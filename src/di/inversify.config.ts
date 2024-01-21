import "reflect-metadata";
import { Container } from "inversify";

import { ApiKeyConfiguration, IApiKeyConfiguration, ILogger, Logger } from "@splitsies/utils";
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
import { IFirebaseConfiguration } from "src/models/configuration/firebase/firebase-configuration-interface";
import { FirebaseConfiguration } from "src/models/configuration/firebase/firebase-configuration";
import { IAuthInteractor } from "src/interactor/auth-interactor-interface";
import { AuthInteractor } from "src/interactor/auth-interactor";
import { AuthProvider } from "src/providers/auth-provider";
import { IAuthProvider } from "src/providers/auth-provider-interface";
import { IAdminAuthProvider } from "src/providers/admin-auth-provider-interface";
import { AdminAuthProvider } from "src/providers/admin-auth-provider";
import { IUserDaoStatements } from "src/dao/user-dao/user-dao-statements-interface";
import { UserDaoStatements } from "src/dao/user-dao/user-dao-statements";
import { IApiConfiguration } from "src/models/configuration/api/api-configuration-interface";
import { ApiConfiguration } from "src/models/configuration/api/api-configuration";
import { IExpenseApiClient } from "src/api/expense-api-client/expense-api-client-interface";
import { ExpenseApiClient } from "src/api/expense-api-client/expense-api-client";
import { IAuthHeaderProvider } from "src/providers/auth-header-provider/auth-header-provider-interface";
import { AuthHeaderProvider } from "src/providers/auth-header-provider/auth-header-provider";
import { ExpenseUserDetailsMapper, IExpenseUserDetailsMapper } from "@splitsies/shared-models";
import { ICreateUserValidator } from "src/validators/create-user-validator/create-user-validator-interface";
import { CreateUserValidator } from "src/validators/create-user-validator/create-user-validator";
const container = new Container();

container.bind<ILogger>(ILogger).to(Logger).inSingletonScope();
container.bind<IUserService>(IUserService).to(UserService).inSingletonScope();
container.bind<IUserManager>(IUserManager).to(UserManager).inSingletonScope();
container.bind<IUserDao>(IUserDao).to(UserDao).inSingletonScope();
container.bind<IUserMapper>(IUserMapper).to(UserMapper).inSingletonScope();
container.bind<IDbConfiguration>(IDbConfiguration).to(DbConfiguration).inSingletonScope();
container.bind<IFirebaseConfiguration>(IFirebaseConfiguration).to(FirebaseConfiguration).inSingletonScope();
container.bind<IAuthInteractor>(IAuthInteractor).to(AuthInteractor);
container.bind<IAuthProvider>(IAuthProvider).to(AuthProvider).inSingletonScope();
container.bind<IAdminAuthProvider>(IAdminAuthProvider).to(AdminAuthProvider).inSingletonScope();
container.bind<IUserDaoStatements>(IUserDaoStatements).to(UserDaoStatements).inSingletonScope();
container.bind<IApiConfiguration>(IApiConfiguration).to(ApiConfiguration).inSingletonScope();
container.bind<IExpenseApiClient>(IExpenseApiClient).to(ExpenseApiClient).inSingletonScope();
container.bind<IAuthHeaderProvider>(IAuthHeaderProvider).to(AuthHeaderProvider).inSingletonScope();
container.bind<IApiKeyConfiguration>(IApiKeyConfiguration).to(ApiKeyConfiguration).inSingletonScope();
container.bind<IExpenseUserDetailsMapper>(IExpenseUserDetailsMapper).to(ExpenseUserDetailsMapper).inSingletonScope();
container.bind<ICreateUserValidator>(ICreateUserValidator).to(CreateUserValidator).inSingletonScope();

export { container };
