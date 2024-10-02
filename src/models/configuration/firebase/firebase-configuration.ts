import { injectable } from "inversify";
import {
    FirebaseConfiguration as UtilsFirebaseConfiguration,
    IFirebaseConfiguration as IFirebaseConfigurationUtils,
} from "@splitsies/utils";
import { IFirebaseConfiguration } from "./firebase-configuration-interface";
@injectable()
export class FirebaseConfiguration
    extends UtilsFirebaseConfiguration
    implements IFirebaseConfiguration, IFirebaseConfigurationUtils
{
    readonly devMode: boolean;
    readonly authTokenTtlMs: number;

    constructor() {
        super();
        this.devMode = process.env.FIREBASE_DEV_MODE === "true";
        this.authTokenTtlMs = parseInt(process.env.FIREBASE_AUTH_TOKEN_TTL_MS);
    }
}
