import { inject, injectable } from "inversify";
import { IUserService } from "./user-service-interface";
import { IUser } from "src/models/user/user-interface";
import { IUserManager } from "src/managers/user-manager/user-manager-interface";
import { CreateUserRequest, IUserCredential } from "@splitsies/shared-models";

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
}
