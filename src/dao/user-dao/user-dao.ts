import { DaoBase, ILogger } from "@splitsies/utils";
import { inject, injectable } from "inversify";
import { IUserMapper } from "src/mappers/user-mapper/user-mapper-interface";
import { IDbConfiguration } from "src/models/configuration/db/db-configuration-interface";
import { IUserDto } from "src/models/user-dto/user-dto-interface";
import { IUser } from "src/models/user/user-interface";
import { IUserDao } from "./user-dao-interface";

@injectable()
export class UserDao extends DaoBase<IUser, IUserDto> implements IUserDao {
    constructor(
        @inject(ILogger) logger: ILogger,
        @inject(IDbConfiguration) dbConfiguration: IDbConfiguration,
        @inject(IUserMapper) mapper: IUserMapper,
    ) {
        const keySelector = (user: IUser) => ({ id: user.id });
        super(logger, dbConfiguration, dbConfiguration.tableName, keySelector, mapper);
    }
}
