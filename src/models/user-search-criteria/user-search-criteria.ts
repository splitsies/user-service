import { IUserSearchCriteria } from "./user-search-criteria-interface";

export class UserSearchCriteria implements IUserSearchCriteria {
    constructor(readonly phoneNumbers: string[]) {}
}
