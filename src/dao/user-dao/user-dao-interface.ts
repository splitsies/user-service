import { IDao } from "@splitsies/utils";
import { IUserSearchCriteria } from "src/models/user-search-criteria/user-search-criteria-interface";
import { IUser } from "src/models/user/user-interface";
import { AttributeValue } from "@aws-sdk/client-dynamodb/dist-types/models/models_0";
import { IScanResult } from "@splitsies/shared-models";

export interface IUserDao extends IDao<IUser> {
    search(
        criteria: IUserSearchCriteria,
        lastEvaluatedKey?: Record<string, AttributeValue> | undefined,
    ): Promise<IScanResult<IUser>>;
}
export const IUserDao = Symbol.for("IUserDao");
