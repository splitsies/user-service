import { assert } from "console";

export class DbConfiguration {
    readonly dbAccessKeyId: string;
    readonly dbSecretAccessKey: string;
    readonly dbRegion: string;
    readonly tableName: string;
    readonly endpoint: string;

    constructor() {
        assert(!!process.env.dbAccessKeyId, "db access key was undefined");
        assert(!!process.env.dbSecretAccessKey, "db secret access key was undefined");
        assert(!!process.env.dbRegion, "db region was undefined");
        assert(!!process.env.dbTableName, "db table name was undefined");
        assert(!!process.env.dbEndpoint, "db endpoint was undefined");

        this.dbAccessKeyId = process.env.dbAccessKeyId;
        this.dbSecretAccessKey = process.env.dbSecretAccessKey;
        this.dbRegion = process.env.dbRegion;
        this.tableName = process.env.dbTableName;
        this.endpoint = process.env.dbEndpoint;
    }
}
