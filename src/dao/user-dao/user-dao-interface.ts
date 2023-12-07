import { IDao } from "@splitsies/utils";
import { IUserSearchCriteria } from "src/models/user-search-criteria/user-search-criteria-interface";
import { IUser } from "src/models/user/user-interface";

export interface IUserDao extends IDao<IUser> {
    findUsers(searchCriteria: IUserSearchCriteria): Promise<IUser[]>;
    findUsersById(ids: string[]): Promise<IUser[]>;
}
export const IUserDao = Symbol.for("IUserDao");
