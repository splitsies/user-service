export interface IDbConfiguration {
    readonly dbRegion: string;
    readonly tableName: string;
    readonly endpoint: string;
}

export const IDbConfiguration = Symbol.for("IDbConfiguration");
