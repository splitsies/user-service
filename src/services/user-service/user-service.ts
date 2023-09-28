import { inject, injectable } from "inversify";
import { IUserService } from "./user-service-interface";
import { IUser } from "src/models/user/user-interface";
import { IUserManager } from "src/managers/user-manager/user-manager-interface";
import { CreateUserRequest } from "@splitsies/shared-models";

@injectable()
export class UserService implements IUserService {
    constructor(@inject(IUserManager) private readonly _userManager: IUserManager) {}

    async createUser(userModel: CreateUserRequest): Promise<IUser> {
        return await this._userManager.createUser(userModel);
    }
}
