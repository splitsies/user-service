import { assert } from "console";

export class DbConfiguration {
    readonly dbRegion: string;
    readonly tableName: string;
    readonly endpoint: string;

    constructor() {
        assert(!!process.env.dbRegion, "db region was undefined");
        assert(!!process.env.dbTableName, "db table name was undefined");
        assert(!!process.env.dbEndpoint, "db endpoint was undefined");

        this.dbRegion = process.env.dbRegion;
        this.tableName = process.env.dbTableName;
        this.endpoint = process.env.dbEndpoint;
    }
}
