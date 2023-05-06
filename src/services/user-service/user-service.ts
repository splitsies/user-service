import { inject, injectable } from "inversify";
import { IUserService } from "./user-service-interface";
import { IUserDto } from "src/models/user-dto/user-dto-interface";
import { IUser } from "src/models/user/user-interface";
import { IUserManager } from "src/managers/user-manager/user-manager-interface";

@injectable()
export class UserService implements IUserService {
    constructor(@inject(IUserManager) private readonly _userManager: IUserManager) {}

    async createUser(userModel: IUserDto): Promise<IUser> {
        return await this._userManager.createUser(userModel);
    }
}
