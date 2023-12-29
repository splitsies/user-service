import { IExpenseUserDetails } from "@splitsies/shared-models";
import { IExpenseApiClient } from "./expense-api-client-interface";
import { inject, injectable } from "inversify";
import { ILogger, SplitsiesApiClientBase } from "@splitsies/utils";
import { IApiConfiguration } from "src/models/configuration/api/api-configuration-interface";
import { IAuthHeaderProvider } from "src/providers/auth-header-provider/auth-header-provider-interface";

@injectable()
export class ExpenseApiClient extends SplitsiesApiClientBase implements IExpenseApiClient {
    constructor(
        @inject(ILogger) private readonly _logger: ILogger,
        @inject(IApiConfiguration) private readonly _apiConfiguration: IApiConfiguration,
        @inject(IAuthHeaderProvider) private readonly _authHeaderProvider: IAuthHeaderProvider,
    ) {
        super();
    }

    async mergeGuestUsers(deletedGuestId: string, registeredUser: IExpenseUserDetails): Promise<void> {
        try {
            const url = `${this._apiConfiguration.expenseApiUrl}guests/${encodeURIComponent(deletedGuestId)}`;
            console.log({ url });
            const response = await this.putJson(url, { registeredUser }, this._authHeaderProvider.provide());
            console.log({ response });
        } catch (e) {
            this._logger.error(e);
        }
    }
}
