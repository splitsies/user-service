import { inject, injectable } from "inversify";
import { IUserService } from "./user-service-interface";
import { IUser } from "src/models/user/user-interface";
import { IUserManager } from "src/managers/user-manager/user-manager-interface";
import { CreateUserRequest, IExpenseUserDetailsMapper, IUserCredential } from "@splitsies/shared-models";
import { IUserSearchCriteria } from "src/models/user-search-criteria/user-search-criteria-interface";
import { IExpenseApiClient } from "src/api/expense-api-client/expense-api-client-interface";

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(IUserManager) private readonly _userManager: IUserManager,
        @inject(IExpenseApiClient) private readonly _expenseApiClient: IExpenseApiClient,
        @inject(IExpenseUserDetailsMapper) private readonly _expenseUserDetailsMapper: IExpenseUserDetailsMapper,
    ) {}

    async getUser(id: string): Promise<IUser> {
        return await this._userManager.getUser(id);
    }

    async createUser(userModel: CreateUserRequest): Promise<IUserCredential> {
        const user = await this._userManager.createUser(userModel);
        const deletedGuestIds = await this._userManager.deleteGuestsWithNumber(user.user.phoneNumber);

        console.log({ deletedGuestIds });

        await Promise.all(
            deletedGuestIds.map((deletedGuestId) =>
                this._expenseApiClient.mergeGuestUsers(
                    deletedGuestId,
                    this._expenseUserDetailsMapper.fromUserDto(user.user),
                ),
            ),
        );

        return user;
    }

    async authenticateUser(username: string, password: string): Promise<IUserCredential> {
        return await this._userManager.authenticateUser(username, password);
    }

    async findUsers(searchCriteria: IUserSearchCriteria): Promise<IUser[]> {
        return await this._userManager.findUsers(searchCriteria);
    }

    async findUsersById(ids: string[]): Promise<IUser[]> {
        return await this._userManager.findUsersById(ids);
    }

    async addGuestUser(givenName: string, familyName: string, phoneNumber: string): Promise<IUser> {
        return await this._userManager.addGuestUser(givenName, familyName, phoneNumber);
    }
}
