import schema from "./schema";
import { middyfy } from "../../libs/lambda";
import { container } from "../../di/inversify.config";
import { HttpStatusCode, DataResponse, IUserCredential } from "@splitsies/shared-models";
import { SplitsiesFunctionHandlerFactory, ILogger } from "@splitsies/utils";
import { IUserService } from "src/services/user-service/user-service-interface";
import { InvalidAuthError } from "src/models/errors";

const logger = container.get<ILogger>(ILogger);
const userService = container.get<IUserService>(IUserService);

export const main = middyfy(
    SplitsiesFunctionHandlerFactory.create<typeof schema, IUserCredential>(logger, async (event) => {
        try {
            const result = await userService.authenticateUser(event.body.username, event.body.password);
            return new DataResponse(HttpStatusCode.OK, result).toJson();
        } catch (ex) {
            if (ex instanceof InvalidAuthError) {
                return new DataResponse(HttpStatusCode.UNAUTHORIZED, "Could not authenticate user").toJson();
            }

            throw ex;
        }
    }),
);
