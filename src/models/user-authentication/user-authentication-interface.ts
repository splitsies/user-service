export interface IUserAuthentication {
    readonly userId: string;
    readonly authToken: string;
    readonly expiresAt: number;
}
