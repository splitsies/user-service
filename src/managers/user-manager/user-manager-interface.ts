import { CreateUserRequest } from "@splitsies/shared-models";
import { IUser } from "src/models/user/user-interface";

export interface IUserManager {
    createUser(userModel: CreateUserRequest): Promise<IUser>;
    getUser(id: string): Promise<IUser>;
}
export const IUserManager = Symbol.for("IUserManager");
