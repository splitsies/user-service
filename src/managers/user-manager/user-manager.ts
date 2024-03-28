import { inject, injectable } from "inversify";
import { IUserManager } from "./user-manager-interface";
import { IUser } from "src/models/user/user-interface";
import { ILogger } from "@splitsies/utils";
import {
    CreateUserRequest,
    IScanResult,
    IUserCredential,
    InvalidArgumentsError,
    ScanResult,
    UserCredential,
} from "@splitsies/shared-models";
import { IAuthInteractor } from "src/interactor/auth-interactor-interface";
import { IUserDao } from "src/dao/user-dao/user-dao-interface";
import { IUserMapper } from "src/mappers/user-mapper/user-mapper-interface";
import { IUserSearchCriteria } from "src/models/user-search-criteria/user-search-criteria-interface";
import { randomUUID } from "crypto";
import { User } from "src/models/user/user";
import { UserSearchCriteria } from "src/models/user-search-criteria/user-search-criteria";
import { AttributeValue } from "@aws-sdk/client-dynamodb/dist-types/models/models_0";
import { ICreateUserValidator } from "src/validators/create-user-validator/create-user-validator-interface";

@injectable()
export class UserManager implements IUserManager {
    constructor(
        @inject(ILogger) private readonly _logger: ILogger,
        @inject(IUserDao) private readonly _userDao: IUserDao,
        @inject(IUserMapper) private readonly _userMapper: IUserMapper,
        @inject(IAuthInteractor) private readonly _authInteractor: IAuthInteractor,
        @inject(ICreateUserValidator) private readonly _createUserValidator: ICreateUserValidator,
    ) {
        console.log("constructed user manager");
    }

    async getUser(id: string): Promise<IUser> {
        return await this._userDao.read({ id });
    }

    async createUser(userModel: CreateUserRequest): Promise<IUserCredential> {
        await this._createUserValidator.validate(userModel);

        let userId = "";

        const userWithFormattedNumber = {
            ...userModel,
            phoneNumber: userModel.phoneNumber.replace(/\D/g, ""),
            username: userModel.username.toLowerCase(),
        } as CreateUserRequest;

        try {
            const userAuth = await this._authInteractor.create(userWithFormattedNumber);
            userId = userAuth.userId;
            const user = await this._userDao.create(
                this._userMapper.toDomainModel({ ...userWithFormattedNumber, id: userAuth.userId }),
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

    async addGuestUser(givenName: string, familyName: string, phoneNumber: string): Promise<IUser> {
        const guid = randomUUID();
        const id = `@splitsies-guest${guid}`;
        const user = new User(id, guid, givenName, familyName, "", phoneNumber, new Date(), "");
        return await this._userDao.create(user);
    }

    async deleteGuestsWithNumber(phoneNumber: string): Promise<string[]> {
        if (!phoneNumber) return [];
        const users = await this._userDao.search(new UserSearchCriteria({ phoneNumbers: [phoneNumber] }));
        const filtered = users.result.filter((u) => u.id.startsWith("@splitsies-guest"));

        if (filtered.length === 0) {
            return [];
        }

        await Promise.all(filtered.map((u) => this._userDao.delete({ id: u.id })));
        return filtered.map((u) => u.id);
    }

    async search(
        criteria: IUserSearchCriteria,
        lastEvaluatedKey: Record<string, AttributeValue> | undefined,
    ): Promise<IScanResult<IUser>> {
        return this._userDao.search(criteria, lastEvaluatedKey);
    }
}
