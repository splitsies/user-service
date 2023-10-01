import { inject, injectable } from "inversify";
import { IUserManager } from "./user-manager-interface";
import { IUser } from "src/models/user/user-interface";
import { ILogger } from "@splitsies/utils";
import { CreateUserRequest, IUserCredential, InvalidArgumentsError, UserCredential } from "@splitsies/shared-models";
import { IAuthInteractor } from "src/interactor/auth-interactor-interface";
import { IUserDao } from "src/dao/user-dao/user-dao-interface";
import { IUserMapper } from "src/mappers/user-mapper/user-mapper-interface";

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
        let userId = '';
        try {
            const userAuth = await this._authInteractor.create(userModel);
            userId = userAuth.userId;
            const user = await this._userDao.create(
                this._userMapper.toDomainModel({ ...userModel, id: userAuth.userId }),
            );
            return new UserCredential(this._userMapper.toDtoModel(user), userAuth.authToken, userAuth.expiresAt);
        } catch (e) {
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
}
