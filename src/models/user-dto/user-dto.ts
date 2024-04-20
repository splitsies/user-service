import { IUserDto } from "./user-dto-interface";

export class UserDto implements IUserDto {
    constructor(
        readonly id: string,
        readonly username: string,
        readonly givenName: string,
        readonly familyName: string,
        readonly email: string,
        readonly phoneNumber?: string,
        readonly dateOfBirth?: string,
        readonly middleName?: string,
    ) {}
}
