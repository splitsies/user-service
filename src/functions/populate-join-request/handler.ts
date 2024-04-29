import "reflect-metadata";
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBStreamHandler } from "aws-lambda";
import { container } from "src/di/inversify.config";
import { IExpenseDto, IQueueMessage } from "@splitsies/shared-models";
import { IUserService } from "src/services/user-service/user-service-interface";
import { IMessageQueueClient } from "@splitsies/utils";

const userService = container.get<IUserService>(IUserService);
const messageQueueClient = container.get<IMessageQueueClient>(IMessageQueueClient);

type Message = {
    userId: string;
    expense: IExpenseDto;
    requestingUserId: string;
};

export const main: DynamoDBStreamHandler = (event, _, callback) => {
    const promises: Promise<void>[] = [];
    const updates: IQueueMessage<Message>[] = [];

    for (const record of event.Records) {
        if (!record.dynamodb?.NewImage) continue;

        const update = unmarshall(record.dynamodb.NewImage as Record<string, AttributeValue>) as IQueueMessage<Message>;
        updates.push(update);

        if (Date.now() > update.ttl) continue;

        const { userId, expense, requestingUserId } = update.data;
        promises.push(userService.populateJoinRequest(userId, expense, requestingUserId));
    }

    promises.push(messageQueueClient.deleteBatch(updates));
    Promise.all(promises).then(() => callback(null));
};
