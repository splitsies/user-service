import { CreateUserRequest } from "@splitsies/shared-models";
import { IUser } from "src/models/user/user-interface";

export interface IUserService {
    createUser(userModel: CreateUserRequest): Promise<IUser>;
}
export const IUserService = Symbol.for("IUserService");
