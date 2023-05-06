import { IUser } from "./user-interface";

export class User implements IUser {
    constructor(
        readonly id: string,
        readonly givenName: string,
        readonly familyName: string,
        readonly email: string,
        readonly phoneNumber: string,
        readonly dateOfBirth: Date,
        readonly middleName?: string,
    ) {}
}
