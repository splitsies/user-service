import {
    FirebaseConfiguration as UtilsFirebaseConfiguration,
    IFirebaseConfiguration as IFirebaseConfigurationUtils,
} from "@splitsies/utils";

export class FirebaseConfiguration
    extends UtilsFirebaseConfiguration
    implements IFirebaseConfigurationUtils
{
    readonly devMode: boolean;
    readonly authTokenTtlMs: number;

    constructor() {
        super();
        this.devMode = process.env.FIREBASE_DEV_MODE === "true";
        this.authTokenTtlMs = parseInt(process.env.FireBaseAuthTokenTtlMs);
    }
}
