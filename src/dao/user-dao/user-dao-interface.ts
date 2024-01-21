import { IDao } from "@splitsies/utils";
import { IUserSearchCriteria } from "src/models/user-search-criteria/user-search-criteria-interface";
import { IUser } from "src/models/user/user-interface";
import { AttributeValue } from "@aws-sdk/client-dynamodb/dist-types/models/models_0";

export interface IUserDao extends IDao<IUser> {
    findUsers(searchCriteria: IUserSearchCriteria): Promise<IUser[]>;
    findUsersById(ids: string[]): Promise<IUser[]>;
    findByUsername(search: string, lastKey?: Record<string, AttributeValue>): Promise<any>;
}
export const IUserDao = Symbol.for("IUserDao");
