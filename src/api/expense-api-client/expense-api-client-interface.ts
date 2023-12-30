import { IExpenseUserDetails } from "@splitsies/shared-models";

export interface IExpenseApiClient {
    mergeGuestUsers(deletedGuestId: string, registeredUser: IExpenseUserDetails): Promise<void>;
}
export const IExpenseApiClient = Symbol.for("IExpenseApiClient");
