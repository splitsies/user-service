import { assert } from "console";
import { injectable } from "inversify";
import { IFirebaseConfiguration } from "./firebase-configuration-interface";

@injectable()
export class FirebaseConfiguration implements IFirebaseConfiguration {
    readonly apiKey: string;
    readonly authDomain: string;
    readonly projectId: string;
    readonly storageBucket: string;
    readonly messagingSenderId: string;
    readonly appId: string;
    readonly measurementId: string;
    readonly devMode: boolean;
    readonly emulatorHost: string;
    readonly authTokenTtlMs: number;

    constructor() {
        assert(!!process.env.FIREBASE_API_KEY, "FIREBASE_API_KEY was undefined");
        assert(!!process.env.FIREBASE_AUTH_DOMAIN, "FIREBASE_AUTH_DOMAIN was undefined");
        assert(!!process.env.FIREBASE_PROJECT_ID, "FIREBASE_PROJECT_ID was undefined");
        assert(!!process.env.FIREBASE_STORAGE_BUCKET, "FIREBASE_STORAGE_BUCKET was undefined");
        assert(!!process.env.FIREBASE_MESSAGING_SENDER_ID, "FIREBASE_MESSAGING_SENDER_ID was undefined");
        assert(!!process.env.FIREBASE_APP_ID, "FIREBASE_APP_ID was undefined");
        assert(!!process.env.FIREBASE_MEASUREMENT_ID, "FIREBASE_MEASUREMENT_ID was undefined");
        assert(!!process.env.FIREBASE_DEV_MODE, "FIREBASE_DEV_MODE was undefined");
        assert(!!process.env.FIREBASE_AUTH_TOKEN_TTL_MS, "FIREBASE_AUTH_TOKEN_TTL_MS was undefined");

        this.apiKey = process.env.FIREBASE_API_KEY;
        this.authDomain = process.env.FIREBASE_AUTH_DOMAIN;
        this.projectId = process.env.FIREBASE_PROJECT_ID;
        this.storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
        this.messagingSenderId = process.env.FIREBASE_MESSAGING_SENDER_ID;
        this.appId = process.env.FIREBASE_APP_ID;
        this.measurementId = process.env.FIREBASE_MEASUREMENT_ID;
        this.devMode = process.env.FIREBASE_DEV_MODE === "true";
        this.emulatorHost = process.env.FIREBASE_EMULATOR_HOST;
        this.authTokenTtlMs = parseInt(process.env.FIREBASE_AUTH_TOKEN_TTL_MS);
    }
}
