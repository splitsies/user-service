export interface IFirebaseConfiguration {
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
    readonly vpcMode: boolean;
}

export const IFirebaseConfiguration = Symbol.for("IFirebaseConfiguration");
