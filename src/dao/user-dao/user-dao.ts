import { DaoBase, ILogger } from "@splitsies/utils";
import { inject, injectable } from "inversify";
import { IUserMapper } from "src/mappers/user-mapper/user-mapper-interface";
import { IDbConfiguration } from "src/models/configuration/db/db-configuration-interface";
import { IUserDto } from "src/models/user-dto/user-dto-interface";
import { IUser } from "src/models/user/user-interface";
import { IUserDao } from "./user-dao-interface";
import { IUserSearchCriteria } from "src/models/user-search-criteria/user-search-criteria-interface";
import { IUserDaoStatements } from "./user-dao-statements-interface";
import { ExecuteStatementCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

@injectable()
export class UserDao extends DaoBase<IUser, IUserDto> implements IUserDao {
    private readonly _chunkSize = 100;
    constructor(
        @inject(ILogger) logger: ILogger,
        @inject(IDbConfiguration) dbConfiguration: IDbConfiguration,
        @inject(IUserMapper) mapper: IUserMapper,
        @inject(IUserDaoStatements) private readonly _userDaoStatements: IUserDaoStatements,
    ) {
        const keySelector = (user: IUser) => ({ id: user.id });
        super(logger, dbConfiguration, dbConfiguration.tableName, keySelector, mapper);
    }

    async findUsers(searchCriteria: IUserSearchCriteria): Promise<IUser[]> {
        // can't have more than 100 in a single query
        const chunks: string[][] = [];

        for (let i = 0; i < searchCriteria.phoneNumbers.length; i += this._chunkSize) {
            chunks.push(searchCriteria.phoneNumbers.slice(i, i + this._chunkSize));
        }

        const users: IUser[] = [];
        for (const chunk of chunks) {
            const placeholders = `[${chunk.map((_) => "?").join(",")}]`;
            const statement = this._userDaoStatements.search.replace("?", placeholders);
            const result = await this._client.send(
                new ExecuteStatementCommand({
                    Statement: statement,
                    Parameters: chunk.map((n) => ({ S: n.slice(-10) })), // use the last 10 digits (ignore country code)
                }),
            );

            if (result.Items?.length) {
                users.push(...result.Items.map((i) => this._mapper.toDomainModel(unmarshall(i) as IUserDto)));
            }
        }

        console.log(JSON.stringify({ users }, null, 2));

        return users;
    }

    async findUsersById(ids: string[]): Promise<IUser[]> {
        const chunks: string[][] = [];

        for (let i = 0; i < ids.length; i += this._chunkSize) {
            chunks.push(ids.slice(i, i + this._chunkSize));
        }

        const users: IUser[] = [];
        for (const chunk of chunks) {
            const placeholders = `[${chunk.map((_) => "?").join(",")}]`;
            const statement = this._userDaoStatements.idSearch.replace("?", placeholders);
            const result = await this._client.send(
                new ExecuteStatementCommand({
                    Statement: statement,
                    Parameters: chunk.map((n) => ({ S: n })),
                }),
            );

            if (result.Items?.length) {
                users.push(...result.Items.map((i) => this._mapper.toDomainModel(unmarshall(i) as IUserDto)));
            }
        }

        return users;
    }
}
