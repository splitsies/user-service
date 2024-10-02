import { initializeApp } from "firebase/app";
import { Auth, getAuth, connectAuthEmulator } from "firebase/auth";
import { injectable, inject } from "inversify";
import { IFirebaseConfiguration } from "src/models/configuration/firebase/firebase-configuration-interface";
import { IAuthProvider } from "./auth-provider-interface";
import { ILogger } from "@splitsies/utils";

@injectable()
export class AuthProvider implements IAuthProvider {
    private readonly auth: Auth;

    constructor(
        @inject(ILogger) logger: ILogger,
        @inject(IFirebaseConfiguration) firebaseConfig: IFirebaseConfiguration,
    ) {
        if (!firebaseConfig.devMode) {
            const firebaseApp = initializeApp(firebaseConfig);
            this.auth = getAuth(firebaseApp);
        } else {
            logger.log("Creating emulated auth");
            initializeApp(firebaseConfig);
            this.auth = getAuth();
            connectAuthEmulator(this.auth, process.env.FIREBASE_USER_EMULATOR_HOST);
        }
    }

    provide(): Auth {
        return this.auth;
    }
}
