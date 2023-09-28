import { CreateUserRequest } from "@splitsies/shared-models";
import { IUser } from "src/models/user/user-interface";

export interface ICreateUserAction {
    run(userModel: CreateUserRequest): Promise<IUser>;
}

export const ICreateUserAction = Symbol.for("ICreateUserAction");
