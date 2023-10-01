import { CreateUserRequest } from "@splitsies/shared-models";
import { IUserAuthentication } from "src/models/user-authentication/user-authentication-interface";

export interface IAuthInteractor {
    create(userModel: CreateUserRequest): Promise<IUserAuthentication>;

    /**
     * Authenticates a user via username and password and returns the user id
     * @param username
     * @param password
     */
    authenticate(username: string, password: string): Promise<IUserAuthentication>;

    delete(userId: string): Promise<void>;
}

export const IAuthInteractor = Symbol.for("IAuthIteractor");
