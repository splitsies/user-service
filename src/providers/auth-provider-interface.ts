import { Auth } from "firebase/auth";

export interface IAuthProvider {
    provide(): Auth;
}

export const IAuthProvider = Symbol.for("IAuthProvider");
