import { IUserDto } from "src/models/user-dto/user-dto-interface";
import { IUser } from "src/models/user/user-interface";

export interface IUserService {
    createUser(userModel: IUserDto): Promise<IUser>;
}
export const IUserService = Symbol.for("IUserService");
