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
}

export const IFirebaseConfiguration = Symbol.for("IFirebaseConfiguration");
