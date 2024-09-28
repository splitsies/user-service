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
        this.devMode = process.env.Stage === "local";
        this.authTokenTtlMs = parseInt(process.env.FireBaseAuthTokenTtlMs);
    }
}
