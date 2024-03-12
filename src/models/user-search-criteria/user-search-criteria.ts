import { IUserSearchCriteria } from "./user-search-criteria-interface";

export class UserSearchCriteria implements IUserSearchCriteria {
    readonly phoneNumbers: string[] | undefined;
    readonly ids: string[] | undefined;
    readonly usernameFilter: string | undefined;

    constructor(params: {
        phoneNumbers?: string[] | undefined;
        ids?: string[] | undefined;
        filter?: string | undefined;
    }) {
        this.phoneNumbers = params.phoneNumbers;
        this.ids = params.ids;
        this.usernameFilter = params.filter;
    }
}
