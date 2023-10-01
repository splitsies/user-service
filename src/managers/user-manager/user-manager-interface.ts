import { CreateUserRequest, IUserCredential } from "@splitsies/shared-models";
import { IUser } from "src/models/user/user-interface";

export interface IUserManager {
    createUser(userModel: CreateUserRequest): Promise<IUserCredential>;
    getUser(id: string): Promise<IUser>;
    authenticateUser(username: string, password: string): Promise<IUserCredential>;
}
export const IUserManager = Symbol.for("IUserManager");
