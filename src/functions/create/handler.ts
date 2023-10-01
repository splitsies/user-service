import schema from "./schema";
import { middyfy } from "../../libs/lambda";
import { container } from "../../di/inversify.config";
import { HttpStatusCode, DataResponse, InvalidArgumentsError, CreateUserRequest, IUserCredential } from "@splitsies/shared-models";
import { SplitsiesFunctionHandlerFactory, ILogger } from "@splitsies/utils";
import { IUserService } from "src/services/user-service/user-service-interface";

const logger = container.get<ILogger>(ILogger);
const userService = container.get<IUserService>(IUserService);

export const main = middyfy(
    SplitsiesFunctionHandlerFactory.create<typeof schema, IUserCredential>(logger, async (event) => {
        if (!event.body.user) return new DataResponse(HttpStatusCode.BAD_REQUEST, "'user' was missing");

        try {
            const result = await userService.createUser(event.body.user as CreateUserRequest);
            return new DataResponse(HttpStatusCode.CREATED, result).toJson();
        } catch (e) {

            logger.error(e);

            if (e instanceof InvalidArgumentsError) {
                return new DataResponse(HttpStatusCode.BAD_REQUEST, e.message).toJson();
            }

            throw e;
        }
    }),
);
