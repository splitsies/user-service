import { inject, injectable } from "inversify";
import { IAuthInteractor } from "./auth-interactor-interface";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { ILogger } from "@splitsies/utils";
import { CreateUserRequest } from "@splitsies/shared-models";
import { IAuthProvider } from "src/providers/auth-provider-interface";
import { InvalidAuthError } from "src/models/errors";
import { IUserAuthentication } from "src/models/user-authentication/user-authentication-interface";
import { UserAuthentication } from "src/models/user-authentication/user-authentication";
import { IAdminAuthProvider } from "src/providers/admin-auth-provider-interface";
import { IFirebaseConfiguration } from "src/models/configuration/firebase/firebase-configuration-interface";

@injectable()
export class AuthInteractor implements IAuthInteractor {
    constructor(
        @inject(ILogger) private readonly logger: ILogger,
        @inject(IAuthProvider) private readonly authProvider: IAuthProvider,
        @inject(IAdminAuthProvider) private readonly adminAuthProvider: IAdminAuthProvider,
        @inject(IFirebaseConfiguration) private readonly firebaseConfig: IFirebaseConfiguration,
    ) {}

    async create(userModel: CreateUserRequest): Promise<IUserAuthentication> {
        try {
            const auth = this.authProvider.provide();

            const userCred = await createUserWithEmailAndPassword(auth, userModel.email, userModel.password);
            const expiresAt = Date.now() + this.firebaseConfig.authTokenTtlMs;

            return new UserAuthentication(userCred.user.uid, await userCred.user.getIdToken(), expiresAt);
        } catch (ex) {
            this.logger.error(ex);
            throw new InvalidAuthError();
        }
    }

    delete(userId: string): Promise<void> {
        const auth = this.adminAuthProvider.provide();
        return auth.deleteUser(userId);
    }

    async authenticate(username: string, password: string): Promise<IUserAuthentication> {
        const auth = this.authProvider.provide();
        try {
            const userCred = await signInWithEmailAndPassword(auth, username, password);
            const expiresAt = Date.now() + this.firebaseConfig.authTokenTtlMs;
            return new UserAuthentication(userCred.user.uid, await userCred.user.getIdToken(true), expiresAt);
        } catch (ex) {
            this.logger.log(ex);
            throw new InvalidAuthError();
        }
    }
}
