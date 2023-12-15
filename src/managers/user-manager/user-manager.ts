import { inject, injectable } from "inversify";
import { IUserManager } from "./user-manager-interface";
import { IUser } from "src/models/user/user-interface";
import { ILogger } from "@splitsies/utils";
import { CreateUserRequest, IUserCredential, InvalidArgumentsError, UserCredential } from "@splitsies/shared-models";
import { IAuthInteractor } from "src/interactor/auth-interactor-interface";
import { IUserDao } from "src/dao/user-dao/user-dao-interface";
import { IUserMapper } from "src/mappers/user-mapper/user-mapper-interface";
import { IUserSearchCriteria } from "src/models/user-search-criteria/user-search-criteria-interface";
import { randomUUID } from "crypto";
import { User } from "src/models/user/user";

@injectable()
export class UserManager implements IUserManager {
    constructor(
        @inject(ILogger) private readonly _logger: ILogger,
        @inject(IUserDao) private readonly _userDao: IUserDao,
        @inject(IUserMapper) private readonly _userMapper: IUserMapper,
        @inject(IAuthInteractor) private readonly _authInteractor: IAuthInteractor,
    ) {}

    async getUser(id: string): Promise<IUser> {
        return await this._userDao.read({ id });
    }

    async createUser(userModel: CreateUserRequest): Promise<IUserCredential> {
        let userId = "";
        try {
            const userAuth = await this._authInteractor.create(userModel);
            userId = userAuth.userId;
            const user = await this._userDao.create(
                this._userMapper.toDomainModel({ ...userModel, id: userAuth.userId }),
            );
            return new UserCredential(this._userMapper.toDtoModel(user), userAuth.authToken, userAuth.expiresAt);
        } catch (e) {
            this._logger.error(e);
            if (userId) {
                await this._authInteractor.delete(userId);
                this._logger.log(`Rolled back creation of user ${userId}`);
            }

            if (e instanceof RangeError) {
                this._logger.error(e.message);
                throw new InvalidArgumentsError(e.message);
            }

            throw e;
        }
    }

    async authenticateUser(username: string, password: string): Promise<IUserCredential> {
        const userAuth = await this._authInteractor.authenticate(username, password);
        const user = await this.getUser(userAuth.userId);
        return new UserCredential(this._userMapper.toDtoModel(user), userAuth.authToken, userAuth.expiresAt);
    }

    async findUsers(searchCriteria: IUserSearchCriteria): Promise<IUser[]> {
        const users = await this._userDao.findUsers(searchCriteria);
        if (users.length === 0) return users;

        // if there's multiple users with the same phone number, return the registered one
        users.sort((a, b) => (a.phoneNumber > b.phoneNumber ? 1 : a.phoneNumber < b.phoneNumber ? -1 : 0));
        let current: IUser = users[0];

        const usersList: IUser[] = [];

        if (
            (current.id.startsWith("@splitsies-guest") && users[1] && users[1].phoneNumber !== current.phoneNumber) ||
            !users[1]
        ) {
            usersList.push(current);
        }

        for (let x = 1; x < users.length; x++) {
            if (current.phoneNumber === users[x].phoneNumber) {
                usersList.push(current.id.startsWith("@splitsies-guest") ? current : users[x]);
                continue;
            } else {
                usersList.push(users[x]);
            }
            current = users[x];
        }

        return usersList;
    }

    findUsersById(ids: string[]): Promise<IUser[]> {
        return this._userDao.findUsersById(ids);
    }

    async addGuestUser(givenName: string, familyName: string, phoneNumber: string): Promise<IUser> {
        const id = `@splitsies-guest${randomUUID()}`;
        const user = new User(id, givenName, familyName, "", phoneNumber, new Date(), "");
        return await this._userDao.create(user);
    }
}
