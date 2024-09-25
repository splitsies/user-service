import schema from "./schema";
import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import { HttpStatusCode, DataResponse, IUserCredential, UserCredential } from "@splitsies/shared-models";
import { SplitsiesFunctionHandlerFactory, Logger } from "@splitsies/utils";
import { InvalidAuthError } from "src/models/errors";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseConfiguration } from "src/models/configuration/firebase/firebase-configuration";
import { UserAuthentication } from "src/models/user-authentication/user-authentication";
import { UserMapper } from "src/mappers/user-mapper/user-mapper";
import { AuthProvider } from "src/providers/auth-provider";
import { UserDao } from "src/dao/user-dao/user-dao";
import { DbConfiguration } from "src/models/configuration/db/db-configuration";

// Avoiding inversify to maximize time efficiency
const logger = new Logger();
const firebaseConfiguration = new FirebaseConfiguration();
const authProvider = new AuthProvider(logger, firebaseConfiguration);
const userMapper = new UserMapper();
const dbConfiguration = new DbConfiguration;
const userDao = new UserDao(logger, dbConfiguration, userMapper);

const middyfy = (handler) => {
    return middy(handler).use(middyJsonBodyParser());
};

export const main = middyfy(
    SplitsiesFunctionHandlerFactory.create<typeof schema, IUserCredential>(logger, async (event) => {
        try {
            const auth = authProvider.provide();
            const userCred = await signInWithEmailAndPassword(auth, event.body.username, event.body.password);
            const expiresAt = Date.now() + firebaseConfiguration.authTokenTtlMs;
            const userAuth = new UserAuthentication(userCred.user.uid, await userCred.user.getIdToken(true), expiresAt);
            const user = await userDao.read({ id: userAuth.userId });
            return new DataResponse(
                HttpStatusCode.OK,
                new UserCredential(userMapper.toDa(user), userAuth.authToken, userAuth.expiresAt)
            ).toJson();
        } catch (ex) {
            if (ex instanceof InvalidAuthError) {
                return new DataResponse(HttpStatusCode.UNAUTHORIZED, "Could not authenticate user").toJson();
            }

            throw ex;
        }
    })
);
