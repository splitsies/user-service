import { IDao } from "@splitsies/utils";
import { IUser } from "src/models/user/user-interface";

export interface IUserDao extends IDao<IUser> {}
export const IUserDao = Symbol.for("IUserDao");
