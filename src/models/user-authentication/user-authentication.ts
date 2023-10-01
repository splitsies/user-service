import { IUserAuthentication } from "./user-authentication-interface";

export class UserAuthentication implements IUserAuthentication {
    constructor(readonly userId: string, readonly authToken: string, readonly expiresAt: number) {}
}
