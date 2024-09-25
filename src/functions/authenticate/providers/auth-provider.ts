import { initializeApp } from "firebase/app";
import { Auth, getAuth, connectAuthEmulator } from "firebase/auth";
import { ILogger } from "@splitsies/utils";
import { FirebaseConfiguration } from "../configuration/firebase/firebase-configuration";

export class AuthProvider {
    private readonly auth: Auth;

    constructor(
        logger: ILogger,
        firebaseConfig: FirebaseConfiguration,
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
