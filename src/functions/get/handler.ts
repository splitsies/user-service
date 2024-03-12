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
        const { phoneNumbers, ids, filter } = event.queryStringParameters;
        if (!phoneNumbers && !ids && !filter) {
            return new DataResponse(HttpStatusCode.BAD_REQUEST, null).toJson();
        }

        const criteria = new UserSearchCriteria({
            phoneNumbers: phoneNumbers?.split(","),
            ids: ids?.split(","),
            filter,
        });
        const lastEvaluatedKey = event.queryStringParameters.lastKey
            ? (JSON.parse(decodeURIComponent(event.queryStringParameters.lastKey)) as Record<string, AttributeValue>)
            : undefined;

        const result = await userService.search(criteria, lastEvaluatedKey);

        const scan = new ScanResult(
            result.result.map((u) => mapper.toDtoModel(u)),
            result.lastEvaluatedKey,
        );

        return new DataResponse(HttpStatusCode.OK, scan).toJson();
    }),
);
