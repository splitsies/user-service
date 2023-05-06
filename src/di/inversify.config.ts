import "reflect-metadata";
import { Container } from "inversify";

import { ILogger, Logger } from "@splitsies/utils";
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
const container = new Container();

container.bind<ILogger>(ILogger).to(Logger).inSingletonScope();

container.bind<IUserService>(IUserService).to(UserService).inSingletonScope();
container.bind<IUserManager>(IUserManager).to(UserManager).inSingletonScope();

container.bind<IUserDao>(IUserDao).to(UserDao).inSingletonScope();
container.bind<IUserMapper>(IUserMapper).to(UserMapper).inSingletonScope();

container.bind<IDbConfiguration>(IDbConfiguration).to(DbConfiguration).inSingletonScope();

export { container };
