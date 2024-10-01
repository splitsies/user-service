import { initializeApp } from "firebase/app";
import { Auth, getAuth, connectAuthEmulator } from "firebase/auth";

export class AuthProvider {
    private readonly auth: Auth;

    constructor(firebaseConfig) {
        if (!firebaseConfig.devMode) {
            const firebaseApp = initializeApp(firebaseConfig);
            this.auth = getAuth(firebaseApp);
        } else {
            initializeApp(firebaseConfig);
            this.auth = getAuth();
            connectAuthEmulator(this.auth, process.env.FIREBASE_USER_EMULATOR_HOST);
        }
    }

    provide(): Auth {
        return this.auth;
    }
}
