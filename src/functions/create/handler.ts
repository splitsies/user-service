import schema from "./schema";
import { middyfy } from "../../libs/lambda";
import { container } from "../../di/inversify.config";
import { HttpStatusCode, DataResponse, InvalidArgumentsError, IUserCredential } from "@splitsies/shared-models";
import { SplitsiesFunctionHandlerFactory, ILogger, ExpectedError } from "@splitsies/utils";
import { IUserService } from "src/services/user-service/user-service-interface";
import { InvalidAuthError, InvalidFormatError, UsernameTakenError } from "src/models/errors";

const logger = container.get<ILogger>(ILogger);
const userService = container.get<IUserService>(IUserService);

export const main = middyfy(
    SplitsiesFunctionHandlerFactory.create<typeof schema, IUserCredential>(
        logger,
        async (event) => {
            if (!event.body.user) return new DataResponse(HttpStatusCode.BAD_REQUEST, "'user' was missing");

            const result = await userService.createUser(event.body.user);
            return new DataResponse(HttpStatusCode.CREATED, result).toJson();
        },
        [
            new ExpectedError(InvalidAuthError, HttpStatusCode.BAD_REQUEST, "Unable to create user"),
            new ExpectedError(InvalidArgumentsError, HttpStatusCode.BAD_REQUEST, ""),
            new ExpectedError(InvalidFormatError, HttpStatusCode.BAD_REQUEST, "Invalid request parameters"),
            new ExpectedError(InvalidFormatError, HttpStatusCode.BAD_REQUEST, "Invalid parameters"),
            new ExpectedError(UsernameTakenError, HttpStatusCode.BAD_REQUEST, "Username was already taken"),
        ],
    ),
);
