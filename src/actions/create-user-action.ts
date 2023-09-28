import { inject, injectable } from "inversify";
import { IUserDao } from "src/dao/user-dao/user-dao-interface";
import { ICreateUserAction } from "./create-user-action-interface";
import { UserCredential, createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { ILogger } from "@splitsies/utils";
import { IUserMapper } from "src/mappers/user-mapper/user-mapper-interface";
import { IUser } from "src/models/user/user-interface";
import { CreateUserRequest } from "@splitsies/shared-models";
import { IAuthProvider } from "src/providers/auth-provider-interface";

@injectable()
export class CreateUserAction implements ICreateUserAction {
    constructor(
        @inject(ILogger) private readonly logger: ILogger,
        @inject(IUserDao) private readonly userDao: IUserDao,
        @inject(IUserMapper) private readonly userMapper: IUserMapper,
        @inject(IAuthProvider) private readonly authProvider: IAuthProvider,
    ) {}

    async run(userModel: CreateUserRequest): Promise<IUser> {
        const auth = this.authProvider.provide();
        let createdAppUser = false;
        let userCred: UserCredential = undefined;

        try {
            userCred = await createUserWithEmailAndPassword(auth, userModel.email, userModel.password);
            const user = this.userMapper.toDomainModel({ ...userModel, id: userCred.user.uid });
            this.userDao.create(user);
            createdAppUser = true;
            return user;
        } catch (ex) {
            if (userCred && !createdAppUser) {
                await deleteUser(userCred.user);
            }

            this.logger.error(ex);
            throw ex;
        }
    }
}
