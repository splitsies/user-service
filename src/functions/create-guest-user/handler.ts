import schema from "./schema";
import { middyfy } from "../../libs/lambda";
import { container } from "../../di/inversify.config";
import { HttpStatusCode, DataResponse, InvalidArgumentsError } from "@splitsies/shared-models";
import { SplitsiesFunctionHandlerFactory, ILogger } from "@splitsies/utils";
import { IUserService } from "src/services/user-service/user-service-interface";
import { InvalidAuthError } from "src/models/errors";
import { IUser } from "src/models/user/user-interface";

const logger = container.get<ILogger>(ILogger);
const userService = container.get<IUserService>(IUserService);

export const main = middyfy(
    SplitsiesFunctionHandlerFactory.create<typeof schema, IUser>(logger, async (event) => {
        if (!event.body.givenName) return new DataResponse(HttpStatusCode.BAD_REQUEST, "'givenName' was missing");

        try {
            const result = await userService.addGuestUser(event.body.givenName);
            return new DataResponse(HttpStatusCode.CREATED, result).toJson();
        } catch (e) {
            if (e instanceof InvalidAuthError) {
                return new DataResponse(HttpStatusCode.BAD_REQUEST, "Unable to create user").toJson();
            }

            if (e instanceof InvalidArgumentsError) {
                return new DataResponse(HttpStatusCode.BAD_REQUEST, e.message).toJson();
            }

            throw e;
        }
    }),
);
