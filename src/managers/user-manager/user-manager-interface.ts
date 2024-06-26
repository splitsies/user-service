import { CreateUserRequest, IScanResult, IUserCredential } from "@splitsies/shared-models";
import { IUserSearchCriteria } from "src/models/user-search-criteria/user-search-criteria-interface";
import { IUser } from "src/models/user/user-interface";
import { AttributeValue } from "@aws-sdk/client-dynamodb/dist-types/models/models_0";

export interface IUserManager {
    createUser(userModel: CreateUserRequest): Promise<IUserCredential>;
    getUser(id: string): Promise<IUser>;
    authenticateUser(username: string, password: string): Promise<IUserCredential>;
    addGuestUser(givenName: string, familyName: string, phoneNumber: string): Promise<IUser>;
    deleteGuestsWithNumber(phoneNumber: string): Promise<string[]>;
    search(
        criteria: IUserSearchCriteria,
        lastEvaluatedKey: Record<string, AttributeValue> | undefined,
    ): Promise<IScanResult<IUser>>;
    deleteUser(userId: string): Promise<boolean>;
}
export const IUserManager = Symbol.for("IUserManager");
