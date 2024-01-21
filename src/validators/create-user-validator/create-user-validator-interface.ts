import { CreateUserRequest } from "@splitsies/shared-models";

export interface ICreateUserValidator {
    validate(createRequest: CreateUserRequest): Promise<void>;
}

export const ICreateUserValidator = Symbol.for("ICreateUserValidator");
