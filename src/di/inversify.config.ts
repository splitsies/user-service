import "reflect-metadata";
import { Container } from "inversify";

import {
    ApiKeyConfiguration,
    FirebaseProvider,
    IApiKeyConfiguration,
    IFirebaseConfiguration,
    IFirebaseProvider,
    ILogger,
    IMessageQueueClient,
    Logger,
    MessageQueueClient,
} from "@splitsies/utils";
import { IUserDao } from "src/dao/user-dao/user-dao-interface";
import { UserDao } from "src/dao/user-dao/user-dao";
import { IUserMapper } from "src/mappers/user-mapper/user-mapper-interface";
import { UserMapper } from "src/mappers/user-mapper/user-mapper";
import { IUserService } from "src/services/user-service/user-service-interface";
import { UserService } from "src/services/user-service/user-service";
import { IUserManager } from "src/managers/user-manager/user-manager-interface";
import { UserManager } from "src/managers/user-manager/user-manager";
import { IDbConfiguration } from "src/models/configuration/db/db-configuration-interface";
import { DbConfiguration } from "src/models/configuration/db/db-configuration";
import { FirebaseConfiguration } from "src/models/configuration/firebase/firebase-configuration";
import { IAuthInteractor } from "src/interactor/auth-interactor-interface";
import { AuthInteractor } from "src/interactor/auth-interactor";
import { AuthProvider } from "src/providers/auth-provider";
import { IAuthProvider } from "src/providers/auth-provider-interface";
import { ExpenseUserDetailsMapper, IExpenseUserDetailsMapper } from "@splitsies/shared-models";
import { ICreateUserValidator } from "src/validators/create-user-validator/create-user-validator-interface";
import { CreateUserValidator } from "src/validators/create-user-validator/create-user-validator";

const container = new Container({ defaultScope: "Singleton" });

container.bind<ILogger>(ILogger).to(Logger);
container.bind<IUserService>(IUserService).to(UserService);
container.bind<IUserManager>(IUserManager).to(UserManager);
container.bind<IUserDao>(IUserDao).to(UserDao);
container.bind<IUserMapper>(IUserMapper).to(UserMapper);
container.bind<IDbConfiguration>(IDbConfiguration).to(DbConfiguration);
container.bind<IFirebaseConfiguration>(IFirebaseConfiguration).to(FirebaseConfiguration);
container.bind<IAuthInteractor>(IAuthInteractor).to(AuthInteractor);
container.bind<IFirebaseProvider>(IFirebaseProvider).to(FirebaseProvider);
container.bind<IAuthProvider>(IAuthProvider).to(AuthProvider);
container.bind<IApiKeyConfiguration>(IApiKeyConfiguration).to(ApiKeyConfiguration);
container.bind<IExpenseUserDetailsMapper>(IExpenseUserDetailsMapper).to(ExpenseUserDetailsMapper);
container.bind<ICreateUserValidator>(ICreateUserValidator).to(CreateUserValidator);
container.bind<IMessageQueueClient>(IMessageQueueClient).to(MessageQueueClient);

export { container };
