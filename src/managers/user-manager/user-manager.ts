import { inject, injectable } from "inversify";
import { IUserManager } from "./user-manager-interface";
import { IUserMapper } from "src/mappers/user-mapper/user-mapper-interface";
import { IUserDao } from "src/dao/user-dao/user-dao-interface";
import { IUser } from "src/models/user/user-interface";
import { IUserDto } from "src/models/user-dto/user-dto-interface";
import { ILogger } from "@splitsies/utils";
import { InvalidArgumentsError } from "@splitsies/shared-models";

@injectable()
export class UserManager implements IUserManager {
    constructor(
        @inject(ILogger) private readonly _logger: ILogger,
        @inject(IUserMapper) private readonly _mapper: IUserMapper,
        @inject(IUserDao) private readonly _userDao: IUserDao,
    ) {}

    async createUser(userModel: IUserDto): Promise<IUser> {
        try {
            return await this._userDao.create(this._mapper.toDomainModel(userModel));
        } catch (e) {
            if (e instanceof RangeError) {
                this._logger.error(e.message);
                throw new InvalidArgumentsError(e.message);
            }

            throw e;
        }
    }
}
