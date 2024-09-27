import { DaoBase, ILogger } from "@splitsies/utils";
import { inject, injectable } from "inversify";
import { IUserMapper } from "src/mappers/user-mapper/user-mapper-interface";
import { IDbConfiguration } from "src/models/configuration/db/db-configuration-interface";
import { IUserDto } from "src/models/user-dto/user-dto-interface";
import { IUser, Key } from "src/models/user/user-interface";
import { IUserDao } from "./user-dao-interface";
import { IUserSearchCriteria } from "src/models/user-search-criteria/user-search-criteria-interface";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { IScanResult, ScanResult } from "@splitsies/shared-models";
import { AttributeValue } from "@aws-sdk/client-dynamodb/dist-types/models/models_0";
import { SearchScanBuilder } from "../search-scan-builder/search-scan-builder";

@injectable()
export class UserDao extends DaoBase<IUserDto, Key, IUser> implements IUserDao {
    constructor(
        @inject(ILogger) logger: ILogger,
        @inject(IDbConfiguration) private dbConfiguration: IDbConfiguration,
        @inject(IUserMapper) mapper: IUserMapper,
    ) {
        const keySelector = (user: IUserDto) => ({ id: user.id });
        super(logger, dbConfiguration, dbConfiguration.tableName, keySelector, mapper);
    }

    async search(
        criteria: IUserSearchCriteria,
        lastEvaluatedKey: Record<string, AttributeValue> | undefined = undefined,
    ): Promise<IScanResult<IUser>> {
        const userScanBuilder = new SearchScanBuilder();
        userScanBuilder.buildIdFilter(criteria);
        userScanBuilder.buildPhoneNumberFilter(criteria);
        userScanBuilder.buildUsernameFilter(criteria);

        const scanParameters = userScanBuilder.getResult();

        const result = await this._client.send(
            new ScanCommand({
                TableName: this.dbConfiguration.tableName,
                ExclusiveStartKey: lastEvaluatedKey,
                FilterExpression: scanParameters.filterExpression,
                ExpressionAttributeNames: {
                    ...scanParameters.attributeNames,
                },
                ExpressionAttributeValues: {
                    ...scanParameters.attributeValues,
                },
            }),
        );

        const scan = new ScanResult(this.unmarshallResults(result), result.LastEvaluatedKey ?? null);

        return scan;
    }
}
