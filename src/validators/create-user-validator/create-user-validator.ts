import { inject, injectable } from "inversify";
import { ICreateUserValidator } from "./create-user-validator-interface";
import { CreateUserRequest } from "@splitsies/shared-models";
import { IUserDao } from "src/dao/user-dao/user-dao-interface";
import { InvalidFormatError, UsernameTakenError } from "src/models/errors";
import { UserSearchCriteria } from "src/models/user-search-criteria/user-search-criteria";

@injectable()
export class CreateUserValidator implements ICreateUserValidator {
    constructor(@inject(IUserDao) private readonly _userDao: IUserDao) {}

    async validate(createRequest: CreateUserRequest): Promise<void> {
        if (createRequest.phoneNumber && !this.validatePhoneNumber(createRequest.phoneNumber)) {
            throw new InvalidFormatError("Phone number was invalid");
        }

        if (!createRequest.username || !this.validateUsername(createRequest.username)) {
            throw new InvalidFormatError("Username was invalid");
        }

        if ((await this._userDao.search(new UserSearchCriteria({ filter: createRequest.username }))).result.length > 0) {
            throw new UsernameTakenError();
        }
    }

    private validatePhoneNumber(phoneNumber: string): boolean {
        const re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        return re.test(phoneNumber);
    }

    private validateUsername(username: string): boolean {
        const re = /^[a-zA-Z0-9\-]*$/;
        return re.test(username);
    }
}
