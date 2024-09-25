import "reflect-metadata";
import schema from "./schema";
import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import { HttpStatusCode, DataResponse, IUserCredential, UserCredential } from "@splitsies/shared-models";
import { SplitsiesFunctionHandlerFactory, Logger } from "@splitsies/utils";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthProvider } from "./providers/auth-provider";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { FirebaseConfiguration } from "./configuration/firebase/firebase-configuration";
import { DbConfiguration } from "./configuration/db/db-configuration";

// Avoiding inversify to maximize time efficiency
const logger = new Logger();
const firebaseConfiguration = new FirebaseConfiguration();
const authProvider = new AuthProvider(logger, firebaseConfiguration);
const dbConfiguration = new DbConfiguration();

const client = new DynamoDBClient({ region: dbConfiguration.dbRegion, endpoint: dbConfiguration.endpoint });


const middyfy = (handler) => {
    return middy(handler).use(middyJsonBodyParser());
};

export const main = middyfy(
    SplitsiesFunctionHandlerFactory.create<typeof schema, IUserCredential>(logger, async (event) => {
        try {
            const auth = authProvider.provide();
            const userCred = await signInWithEmailAndPassword(auth, event.body.username, event.body.password);
            const expiresAt = Date.now() + firebaseConfiguration.authTokenTtlMs;

            const response = await client.send(new GetItemCommand({
                TableName: dbConfiguration.tableName,
                Key: { id: { S: userCred.user.uid } }
            }));

            
            const user = !response.Item ? undefined :  {
                id: response.Item.id.S,
                username: response.Item.username.S,
                givenName: response.Item.givenName.S,
                familyName: response.Item.familyName.S,
                email: response.Item.email.S,
                phoneNumber: response.Item.phoneNumber.S,
                dateOfBirth: response.Item.dateOfBirth.S,
                middleName: response.Item.middleName.S,
            };


            return new DataResponse(
                HttpStatusCode.OK,
                new UserCredential(user, await userCred.user.getIdToken(true), expiresAt)
            ).toJson();
        } catch (ex) {
            // if (ex instanceof InvalidAuthError) {
            //     return new DataResponse(HttpStatusCode.UNAUTHORIZED, "Could not authenticate user").toJson();
            // }

            throw ex;
        }
    })
);
