import { CreateUserRequest, IScanResult, IUserCredential } from "@splitsies/shared-models";
import { IUserSearchCriteria } from "src/models/user-search-criteria/user-search-criteria-interface";
import { IUser } from "src/models/user/user-interface";
import { AttributeValue } from "@aws-sdk/client-dynamodb/dist-types/models/models_0";

export interface IUserService {
    createUser(userModel: CreateUserRequest): Promise<IUserCredential>;
    getUser(id: string): Promise<IUser>;
    authenticateUser(username: string, password: string): Promise<IUserCredential>;
    findUsers(searchCriteria: IUserSearchCriteria): Promise<IUser[]>;
    findUsersById(ids: string[]): Promise<IUser[]>;
    addGuestUser(givenName: string, familyName: string, phoneNumber: string): Promise<IUser>;
    findByUsername(search: string, lastKey: Record<string, AttributeValue> | undefined): Promise<IScanResult<IUser>>;
}
export const IUserService = Symbol.for("IUserService");
