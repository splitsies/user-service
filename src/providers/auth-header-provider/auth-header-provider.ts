import { inject, injectable } from "inversify";
import { IAuthHeaderProvider } from "./auth-header-provider-interface";
import { IApiKeyConfiguration } from "@splitsies/utils";

@injectable()
export class AuthHeaderProvider implements IAuthHeaderProvider {
    constructor(@inject(IApiKeyConfiguration) private readonly _apiKeyConfiguration: IApiKeyConfiguration) {}

    provide(): { Authorization: string } {
        return {
            Authorization: `Basic ${this._apiKeyConfiguration.internalApiKey}`,
        };
    }
}
