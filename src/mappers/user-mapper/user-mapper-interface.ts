import { IDtoMapper } from "@splitsies/shared-models";
import { IUserDto } from "src/models/user-dto/user-dto-interface";
import { IUser } from "src/models/user/user-interface";

export interface IUserMapper extends IDtoMapper<IUser, IUserDto> {}
export const IUserMapper = Symbol.for("IUserMapper");
