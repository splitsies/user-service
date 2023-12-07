export interface IUserDaoStatements {
    readonly search: string;
    readonly idSearch: string;
}

export const IUserDaoStatements = Symbol.for("IUserDaoStatements");
