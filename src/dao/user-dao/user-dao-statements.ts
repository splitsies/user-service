import { inject, injectable } from "inversify";
import { IUserDaoStatements } from "./user-dao-statements-interface";
import { IDbConfiguration } from "src/models/configuration/db/db-configuration-interface";

@injectable()
export class UserDaoStatements implements IUserDaoStatements {
    readonly search: string;
    readonly idSearch: string;

    constructor(@inject(IDbConfiguration) dbConfiguration: IDbConfiguration) {
        this.search = `SELECT * FROM "${dbConfiguration.tableName}" WHERE phoneNumber IN ?`;
        this.idSearch = `SELECT * FROM "${dbConfiguration.tableName}" WHERE id IN ?`;
    }
}
