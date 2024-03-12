import { DaoBase, ILogger } from "@splitsies/utils";
import { inject, injectable } from "inversify";
import { IUserMapper } from "src/mappers/user-mapper/user-mapper-interface";
import { IDbConfiguration } from "src/models/configuration/db/db-configuration-interface";
import { IUserDto } from "src/models/user-dto/user-dto-interface";
import { IUser } from "src/models/user/user-interface";
import { IUserDao } from "./user-dao-interface";
import { IUserSearchCriteria } from "src/models/user-search-criteria/user-search-criteria-interface";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
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
    ) {
        const keySelector = (user: IUser) => ({ id: user.id });
        super(logger, dbConfiguration, dbConfiguration.tableName, keySelector, mapper);
    }

    async search(
        criteria: IUserSearchCriteria,
        lastEvaluatedKey: Record<string, AttributeValue> | undefined = undefined,
    ): Promise<IScanResult<IUser>> {
        let filterClauses: string[] = [];
        let filterParams = {};
        let attributeParams = {};

        if (criteria.phoneNumbers !== undefined) {
            filterParams["#phoneNumber"] = "phoneNumber";
            const numbers = new Set<string>();
            criteria.phoneNumbers.forEach((n) => {
                numbers.add(n.slice(-10));
            });

            const expressionAttributes = {};
            const numbersParams = [];
            Array.from(numbers).forEach((num, index) => {
                const placeholder = `:num${index}`;
                numbersParams.push(placeholder);
                expressionAttributes[placeholder] = { S: num };
            });

            const expressionPieces: string[] = [];

            for (let i = 0; i < numbersParams.length; i += this._chunkSize) {
                expressionPieces.push(`#phoneNumber in (${numbersParams.slice(i, i + this._chunkSize).join(",")})`);
            }

            attributeParams = { ...attributeParams, ...expressionAttributes };

            // Max 100 operands in IN operator, need to split up if more
            filterClauses.push(`(${expressionPieces.join(" OR ")})`);
        }

        if (criteria.ids !== undefined) {
            filterParams["#id"] = "id";
            const ids = new Set<string>();
            criteria.ids.forEach((n) => {
                ids.add(n);
            });

            const expressionAttributes = {};
            const params = [];
            Array.from(ids).forEach((id, index) => {
                const placeholder = `:id${index}`;
                params.push(placeholder);
                expressionAttributes[placeholder] = { S: id };
            });

            const expressionPieces: string[] = [];

            for (let i = 0; i < params.length; i += this._chunkSize) {
                expressionPieces.push(`#id in (${params.slice(i, i + this._chunkSize).join(",")})`);
            }

            attributeParams = { ...attributeParams, ...expressionAttributes };

            // Max 100 operands in IN operator, need to split up if more
            filterClauses.push(`(${expressionPieces.join(" OR ")})`);
        }

        if (criteria.usernameFilter !== undefined) {
            if (!filterParams["#id"]) {
                filterParams["#id"] = "id";
            }
            filterParams["#username"] = "username";

            attributeParams = {
                ...attributeParams,
                ":usernameFilter": { S: criteria.usernameFilter },
                ":guestPrefix": { S: "@splitsies-guest" },
            };

            filterClauses.push(`(begins_with(#username, :usernameFilter) AND NOT begins_with(#id, :guestPrefix))`);
        }

        const filterExpression = filterClauses.join(" AND ");

        const result = await this._client.send(
            new ScanCommand({
                TableName: this.dbConfiguration.tableName,
                ExclusiveStartKey: lastEvaluatedKey,
                FilterExpression: filterExpression,
                ExpressionAttributeNames: {
                    ...filterParams,
                },
                ExpressionAttributeValues: {
                    ...attributeParams,
                },
            }),
        );

        const scan = new ScanResult(
            result.Items.map((i) => this._mapper.toDomainModel(unmarshall(i) as IUserDto)),
            result.LastEvaluatedKey ?? null,
        );

        return scan;
    }
}
