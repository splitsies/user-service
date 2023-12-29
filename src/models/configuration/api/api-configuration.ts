import { assert } from "console";
import { IApiConfiguration } from "./api-configuration-interface";
import { injectable } from "inversify";

@injectable()
export class ApiConfiguration implements IApiConfiguration {
    readonly expenseApiUrl: string;

    constructor() {
        assert(!!process.env.EXPENSE_API_URL, "EXPENSE_API_URL was undefined");
        this.expenseApiUrl = process.env.EXPENSE_API_URL;
    }
}
