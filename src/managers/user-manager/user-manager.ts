import { inject, injectable } from "inversify";
import { IUserManager } from "./user-manager-interface";
import { IUser } from "src/models/user/user-interface";
import { ILogger } from "@splitsies/utils";
import { CreateUserRequest, InvalidArgumentsError } from "@splitsies/shared-models";
import { ICreateUserAction } from "src/actions/create-user-action-interface";
import { IUserDao } from "src/dao/user-dao/user-dao-interface";

@injectable()
export class UserManager implements IUserManager {
    constructor(
        @inject(ILogger) private readonly _logger: ILogger,
        @inject(IUserDao) private readonly _userDao: IUserDao,
        @inject(ICreateUserAction) private readonly _createUserAction: ICreateUserAction,
    ) {}

    async getUser(id: string): Promise<IUser> {
        return await this._userDao.read({ id });
    }

    async createUser(userModel: CreateUserRequest): Promise<IUser> {
        try {
            return await this._createUserAction.run(userModel);
        } catch (e) {
            if (e instanceof RangeError) {
                this._logger.error(e.message);
                throw new InvalidArgumentsError(e.message);
            }

            throw e;
        }
    }
}
