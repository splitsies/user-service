import schema from "./schema";
import { middyfy } from "../../libs/lambda";
import { container } from "../../di/inversify.config";
import {
    HttpStatusCode,
    DataResponse,
    InvalidArgumentsError,
    CreateUserRequest,
    IUserCredential,
} from "@splitsies/shared-models";
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

            try {
                const createRequest = {
                    ...event.body.user,
                    middleName: event.body.user.middleName ?? "",
                } as CreateUserRequest;

                const result = await userService.createUser(createRequest);
                return new DataResponse(HttpStatusCode.CREATED, result).toJson();
            } catch (e) {
                if (e instanceof InvalidAuthError) {
                    return new DataResponse(HttpStatusCode.BAD_REQUEST, "Unable to create user").toJson();
                }

                if (e instanceof InvalidArgumentsError) {
                    return new DataResponse(HttpStatusCode.BAD_REQUEST, e.message).toJson();
                }

                if (e instanceof InvalidFormatError) {
                    return new DataResponse(HttpStatusCode.BAD_REQUEST, "Invalid request parameters").toJson();
                }

                throw e;
            }
        },
        [
            new ExpectedError(InvalidFormatError, HttpStatusCode.BAD_REQUEST, "Invalid parameters"),
            new ExpectedError(UsernameTakenError, HttpStatusCode.BAD_REQUEST, "Username was already taken"),
        ],
    ),
);
