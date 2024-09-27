import "reflect-metadata";
import { signInWithEmailAndPassword } from "firebase/auth";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { AuthProvider } from "./auth-provider";

const firebaseConfiguration = {
    apiKey: process.env.FIREBASE_API_KEY || process.env.FirebaseApiKey,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || process.env.FirebaseAuthDomain,
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.FirebaseProjectId,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.FirebaseStorageBucket,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || process.env.FirebaseMessagingSenderId,
    appId: process.env.FIREBASE_APP_ID || process.env.FirebaseAppId,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || process.env.FirebaseMeasurementId,
    emulatorHost: process.env.FIREBASE_AUTH_EMULATOR_HOST || process.env.FirebaseAuthEmulatorHost,
    authTokenTtlMs: parseInt(process.env.FireBaseAuthTokenTtlMs),
};

const authProvider = new AuthProvider(firebaseConfiguration);

const snsClient = new SNSClient({ region: process.env.dbRegion });
const client = new DynamoDBClient({
    region: process.env.dbRegion,
    endpoint: process.env.dbEndpoint,
});

/**
 * reducing package references for maximum performance
 */
export const main = async (event) => {
    const { username, password } = JSON.parse(event.body);

    const userCred = await signInWithEmailAndPassword(authProvider.provide(), username, password);
    await snsClient.send(
        new PublishCommand({
            TopicArn: process.env.UserConnectedTopicArn,
            Message: JSON.stringify({ data: process.env.RtRegion ?? "us-east-1" }),
        }),
    );

    const expiresAt = Date.now() + firebaseConfiguration.authTokenTtlMs;
    const user = await client.send(
        new GetItemCommand({
            TableName: process.env.dbTableName,
            Key: { id: { S: userCred.user.uid } },
        }),
    );

    const unmarshalledUser = !user.Item
        ? undefined
        : {
              phoneNumber: user.Item.phoneNumber?.S,
              username: user.Item.username?.S,
              dateOfBirth: user.Item.dateOfBirth?.S,
              id: user.Item.id?.S,
              email: user.Item.email?.S,
              familyName: user.Item.familyName?.S,
              givenName: user.Item.givenName?.S,
              middleName: user.Item.middleName?.S,
          };

    return {
        statusCode: 200,
        body: JSON.stringify({
            statusCode: 200,
            data: {
                user: unmarshalledUser,
                authToken: await userCred.user.getIdToken(true),
                expiresAt,
            },
            success: true,
        }),
    };
};
