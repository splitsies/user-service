import { DaoBase, ILogger } from "@splitsies/utils";
import { inject, injectable } from "inversify";
import { IUserMapper } from "src/mappers/user-mapper/user-mapper-interface";
import { IDbConfiguration } from "src/models/configuration/db/db-configuration-interface";
import { IUserDto } from "src/models/user-dto/user-dto-interface";
import { IUser } from "src/models/user/user-interface";
import { IUserDao } from "./user-dao-interface";
import { IUserSearchCriteria } from "src/models/user-search-criteria/user-search-criteria-interface";
import { IUserDaoStatements } from "./user-dao-statements-interface";
import { ExecuteStatementCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { IScanResult, ScanResult } from "@splitsies/shared-models";
import { AttributeValue } from "@aws-sdk/client-dynamodb/dist-types/models/models_0";

@injectable()
export class UserDao extends DaoBase<IUser, IUserDto> implements IUserDao {
    private readonly _chunkSize = 100;
    constructor(
        @inject(ILogger) logger: ILogger,
        @inject(IDbConfiguration) private dbConfiguration: IDbConfiguration,
        @inject(IUserMapper) mapper: IUserMapper,
        @inject(IUserDaoStatements) private readonly _userDaoStatements: IUserDaoStatements,
    ) {
        const keySelector = (user: IUser) => ({ id: user.id });
        super(logger, dbConfiguration, dbConfiguration.tableName, keySelector, mapper);
    }

    async findByUsername(
        search: string,
        lastKey: Record<string, AttributeValue> | undefined,
    ): Promise<IScanResult<IUser>> {
        const result = await this._client.send(
            new ScanCommand({
                TableName: this.dbConfiguration.tableName,
                ExclusiveStartKey: lastKey,
                FilterExpression: "begins_with(#username, :search) AND NOT begins_with(#id, :guestPrefix)",
                ExpressionAttributeNames: {
                    "#id": "id",
                    "#username": "username",
                },
                ExpressionAttributeValues: {
                    ":search": { S: search.toLowerCase() },
                    ":guestPrefix": { S: "@splitsies-guest" },
                },
            }),
        );

        const scan = new ScanResult(
            result.Items.map((i) => this._mapper.toDomainModel(unmarshall(i) as IUserDto)),
            result.LastEvaluatedKey ?? null,
        );

        return scan;
    }

    async findUsers(searchCriteria: IUserSearchCriteria): Promise<IUser[]> {
        // can't have more than 100 in a single query
        const chunks: string[][] = [];

        const uniqueNumbers = searchCriteria.phoneNumbers.reduce(
            (included: string[], currentNumber: string) =>
                included.includes(currentNumber.slice(-10)) ? included : [...included, currentNumber.slice(-10)],
            [],
        );

        for (let i = 0; i < uniqueNumbers.length; i += this._chunkSize) {
            chunks.push(uniqueNumbers.slice(i, i + this._chunkSize));
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
