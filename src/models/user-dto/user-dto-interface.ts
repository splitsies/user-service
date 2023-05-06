import { IUser } from "../user/user-interface";

export interface IUserDto extends Omit<IUser, "dateOfBirth"> {
    readonly dateOfBirth: string;
}
