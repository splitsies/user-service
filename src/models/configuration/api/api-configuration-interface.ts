export interface IApiConfiguration {
    readonly expenseApiUrl;
}

export const IApiConfiguration = Symbol.for("IApiConfiguration");
