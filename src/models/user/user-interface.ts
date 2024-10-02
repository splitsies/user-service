export interface IUser {
    readonly id: string;
    readonly username: string;
    readonly givenName: string;
    readonly middleName?: string;
    readonly familyName: string;
    readonly email: string;
    readonly phoneNumber?: string;
    readonly dateOfBirth?: Date;
}
