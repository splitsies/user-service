import { CreateUserRequest, IUserCredential } from "@splitsies/shared-models";
import { IUserSearchCriteria } from "src/models/user-search-criteria/user-search-criteria-interface";
import { IUser } from "src/models/user/user-interface";

export interface IUserManager {
    createUser(userModel: CreateUserRequest): Promise<IUserCredential>;
    getUser(id: string): Promise<IUser>;
    authenticateUser(username: string, password: string): Promise<IUserCredential>;
    findUsers(searchCriteria: IUserSearchCriteria): Promise<IUser[]>;
    findUsersById(ids: string[]): Promise<IUser[]>;
    addGuestUser(givenName: string, familyName: string, phoneNumber: string): Promise<IUser>;
    deleteGuestsWithNumber(phoneNumber: string): Promise<string[]>;
}
export const IUserManager = Symbol.for("IUserManager");
