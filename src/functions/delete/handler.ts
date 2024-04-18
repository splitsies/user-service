import schema from "./schema";
import { middyfy } from "../../libs/lambda";
import { container } from "../../di/inversify.config";
import { HttpStatusCode, DataResponse, IUserCredential } from "@splitsies/shared-models";
import { SplitsiesFunctionHandlerFactory, ILogger } from "@splitsies/utils";
import { IUserService } from "src/services/user-service/user-service-interface";

const logger = container.get<ILogger>(ILogger);
const userService = container.get<IUserService>(IUserService);

export const main = middyfy(
    SplitsiesFunctionHandlerFactory.create<typeof schema, IUserCredential>(
        logger,
        async (event) => {
            await userService.deleteUser(event.pathParameters.id);
            return new DataResponse(HttpStatusCode.OK, null).toJson();
        },
    ),
);
