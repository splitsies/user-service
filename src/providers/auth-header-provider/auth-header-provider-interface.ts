export interface IAuthHeaderProvider {
    provide(): { Authorization: string };
}
export const IAuthHeaderProvider = Symbol.for("IAuthHeaderProvider");
