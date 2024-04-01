import { inject, injectable } from "inversify";
import { IUserService } from "./user-service-interface";
import { IUser } from "src/models/user/user-interface";
import { IUserManager } from "src/managers/user-manager/user-manager-interface";
import { CreateUserRequest, IExpenseUserDetailsMapper, IScanResult, IUserCredential, QueueMessage } from "@splitsies/shared-models";
import { IUserSearchCriteria } from "src/models/user-search-criteria/user-search-criteria-interface";
import { AttributeValue } from "@aws-sdk/client-dynamodb/dist-types/models/models_0";
import { IMessageQueueClient } from "@splitsies/utils";
import { QueueConfig } from "src/config/queue.config";
import { randomUUID } from "crypto";

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(IUserManager) private readonly _userManager: IUserManager,
        @inject(IExpenseUserDetailsMapper) private readonly _expenseUserDetailsMapper: IExpenseUserDetailsMapper,
        @inject(IMessageQueueClient) private readonly _messageQueueClient: IMessageQueueClient
    ) { }

    async getUser(id: string): Promise<IUser> {
        return await this._userManager.getUser(id);
    }

    async createUser(userModel: CreateUserRequest): Promise<IUserCredential> {
        const user = await this._userManager.createUser(userModel);
        const deletedGuestIds = await this._userManager.deleteGuestsWithNumber(user.user.phoneNumber);

        const payload = deletedGuestIds.map((deletedGuestId) => ({ deletedGuestId, user: this._expenseUserDetailsMapper.fromUserDto(user.user) }));
        console.log({ payload });
        await this._messageQueueClient.create(new QueueMessage(QueueConfig.guestUserReplaced, randomUUID(), payload));

        return user;
    }

    async authenticateUser(username: string, password: string): Promise<IUserCredential> {
        return await this._userManager.authenticateUser(username, password);
    }

    async addGuestUser(givenName: string, familyName: string, phoneNumber: string): Promise<IUser> {
        return await this._userManager.addGuestUser(givenName, familyName, phoneNumber);
    }

    async search(
        criteria: IUserSearchCriteria,
        lastEvaluatedKey: Record<string, AttributeValue> | undefined,
    ): Promise<IScanResult<IUser>> {
        return this._userManager.search(criteria, lastEvaluatedKey);
    }
}
