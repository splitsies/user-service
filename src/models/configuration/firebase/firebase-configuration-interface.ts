import { IFirebaseConfiguration as IFirebaseConfigurationUtils } from "@splitsies/utils";

export interface IFirebaseConfiguration extends IFirebaseConfigurationUtils {
    readonly devMode: boolean;
    readonly authTokenTtlMs: number;
}

export const IFirebaseConfiguration = Symbol.for("IFirebaseConfiguration");
