import schema from "./schema";
import { middyfy } from "../../libs/lambda";
import { container } from "../../di/inversify.config";
import { HttpStatusCode, DataResponse, InvalidArgumentsError } from "@splitsies/shared-models";
import { SplitsiesFunctionHandlerFactory, ILogger } from "@splitsies/utils";
import { IUserService } from "src/services/user-service/user-service-interface";
import { IUserMapper } from "src/mappers/user-mapper/user-mapper-interface";
import { IUserDto } from "src/models/user-dto/user-dto-interface";

const logger = container.get<ILogger>(ILogger);
const userService = container.get<IUserService>(IUserService);
const mapper = container.get<IUserMapper>(IUserMapper);

export const main = middyfy(
    SplitsiesFunctionHandlerFactory.create<typeof schema, IUserDto>(logger, async (event) => {
        try {
            const result = await userService.createUser(event.body.user as IUserDto);
            return new DataResponse(HttpStatusCode.CREATED, mapper.toDtoModel(result)).toJson();
        } catch (e) {
            if (e instanceof InvalidArgumentsError) {
                return new DataResponse(HttpStatusCode.BAD_REQUEST, e.message);
            }

            throw e;
        }
    })
);
