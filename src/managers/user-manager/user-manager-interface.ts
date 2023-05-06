import { IUserDto } from "src/models/user-dto/user-dto-interface";
import { IUser } from "src/models/user/user-interface";

export interface IUserManager {
    createUser(userModel: IUserDto): Promise<IUser>;
}
export const IUserManager = Symbol.for("IUserManager");
