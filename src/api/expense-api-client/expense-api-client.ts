import { IExpenseUserDetails } from "@splitsies/shared-models";
import { IExpenseApiClient } from "./expense-api-client-interface";
import { inject, injectable } from "inversify";
import { SplitsiesApiClientBase } from "@splitsies/utils";
import { IApiConfiguration } from "src/models/configuration/api/api-configuration-interface";
import { IAuthHeaderProvider } from "src/providers/auth-header-provider/auth-header-provider-interface";

@injectable()
export class ExpenseApiClient extends SplitsiesApiClientBase implements IExpenseApiClient {
    constructor(
        @inject(IApiConfiguration) private readonly _apiConfiguration: IApiConfiguration,

        @inject(IAuthHeaderProvider) private readonly _authHeaderProvider,
    ) {
        super();
    }

    async mergeGuestUsers(deletedGuestId: string, registeredUser: IExpenseUserDetails): Promise<void> {
        const url = `${this._apiConfiguration.expenseApiUrl}guests/${encodeURIComponent(deletedGuestId)}`;
        await this.putJson(url, { registeredUser }, this._authHeaderProvider.provide());
    }
}
