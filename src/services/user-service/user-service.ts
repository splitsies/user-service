import { inject, injectable } from "inversify";
import { IUserService } from "./user-service-interface";
import { IUser } from "src/models/user/user-interface";
import { IUserManager } from "src/managers/user-manager/user-manager-interface";
import { CreateUserRequest, IUserCredential } from "@splitsies/shared-models";
import { IUserSearchCriteria } from "src/models/user-search-criteria/user-search-criteria-interface";

@injectable()
export class UserService implements IUserService {
    constructor(@inject(IUserManager) private readonly _userManager: IUserManager) {}

    async getUser(id: string): Promise<IUser> {
        return await this._userManager.getUser(id);
    }

    async createUser(userModel: CreateUserRequest): Promise<IUserCredential> {
        return await this._userManager.createUser(userModel);
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
