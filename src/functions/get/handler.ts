import schema from "./schema";
import { middyfy } from "../../libs/lambda";
import { container } from "../../di/inversify.config";
import { HttpStatusCode, DataResponse, IScanResult, ScanResult } from "@splitsies/shared-models";
import { SplitsiesFunctionHandlerFactory, ILogger } from "@splitsies/utils";
import { IUserService } from "src/services/user-service/user-service-interface";
import { IUserMapper } from "src/mappers/user-mapper/user-mapper-interface";
import { IUserDto } from "src/models/user-dto/user-dto-interface";
import { UserSearchCriteria } from "src/models/user-search-criteria/user-search-criteria";
import { AttributeValue } from "@aws-sdk/client-dynamodb/dist-types/models/models_0";

const logger = container.get<ILogger>(ILogger);
const userService = container.get<IUserService>(IUserService);
const mapper = container.get<IUserMapper>(IUserMapper);

export const main = middyfy(
    SplitsiesFunctionHandlerFactory.create<typeof schema, IUserDto[] | IScanResult<IUserDto>>(logger, async (event) => {
        if (event.queryStringParameters.ids !== undefined) {
            const ids = event.queryStringParameters.ids.split(",");
            const result = await userService.findUsersById(ids);

            return !!result
                ? new DataResponse(
                      HttpStatusCode.OK,
                      result.map((u) => mapper.toDtoModel(u)),
                  ).toJson()
                : new DataResponse(HttpStatusCode.NOT_FOUND, undefined).toJson();
        } else if (event.queryStringParameters.phoneNumbers !== undefined) {
            const phoneNumbers = event.queryStringParameters.phoneNumbers.split(",");
            const searchCriteria = new UserSearchCriteria(phoneNumbers);
            const lastKey = event.queryStringParameters.lastKey
                ? (JSON.parse(decodeURIComponent(event.queryStringParameters.lastKey)) as Record<
                      string,
                      AttributeValue
                  >)
                : undefined;

            const result = await userService.findUsers(searchCriteria, lastKey);
            const scan = new ScanResult(
                result.result.map((u) => mapper.toDtoModel(u)),
                result.lastEvaluatedKey,
            );

            return new DataResponse(HttpStatusCode.OK, scan).toJson();
        } else if (event.queryStringParameters.filter !== undefined) {
            const search = decodeURIComponent(event.queryStringParameters.filter);
            const lastKey = event.queryStringParameters.lastKey
                ? (JSON.parse(decodeURIComponent(event.queryStringParameters.lastKey)) as Record<
                      string,
                      AttributeValue
                  >)
                : undefined;

            const result = await userService.findByUsername(search, lastKey);

            const scan = new ScanResult(
                result.result.map((u) => mapper.toDtoModel(u)),
                result.lastEvaluatedKey,
            );

            return new DataResponse(HttpStatusCode.OK, scan).toJson();
        }

        return new DataResponse(HttpStatusCode.OK, []).toJson();
    }),
);
