import schema from "./schema";
import { middyfy } from "../../libs/lambda";
import { container } from "../../di/inversify.config";
import { HttpStatusCode, DataResponse } from "@splitsies/shared-models";
import { SplitsiesFunctionHandlerFactory, ILogger } from "@splitsies/utils";
import { IUserService } from "src/services/user-service/user-service-interface";
import { IUserMapper } from "src/mappers/user-mapper/user-mapper-interface";
import { IUserDto } from "src/models/user-dto/user-dto-interface";

const logger = container.get<ILogger>(ILogger);
const userService = container.get<IUserService>(IUserService);
const mapper = container.get<IUserMapper>(IUserMapper);

export const main = middyfy(
    SplitsiesFunctionHandlerFactory.create<typeof schema, IUserDto>(logger, async (event) => {
        if (!event.pathParameters.id) return new DataResponse(HttpStatusCode.BAD_REQUEST, "'id' was missing");

        const result = await userService.getUser(event.pathParameters.id);

        return !!result
            ? new DataResponse(HttpStatusCode.OK, mapper.toDtoModel(result)).toJson()
            : new DataResponse(HttpStatusCode.NOT_FOUND, undefined).toJson();
    }),
);
