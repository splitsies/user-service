import type { AWS } from '@serverless/typescript';

import create from '@functions/create';
import getById from '@functions/getById';
import authenticate from '@functions/authenticate';
import findUsers from "@functions/get";
import createGuestUser from "@functions/create-guest-user";
import deleteUser from '@functions/delete';
import populateJoinRequest from '@functions/populate-join-request';

import dbConfig from 'src/config/db.config.json';
import firebaseConfig from 'src/config/firebase.config.json';

const serverlessConfiguration: AWS = {
    org: 'splitsies',
    app: 'user-service',
    service: 'user-service',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild', 'serverless-offline'],
    provider: {
        name: 'aws',
        runtime: 'nodejs18.x',
        stage: 'dev-pr',
        apiGateway: {
        minimumCompressionSize: 1024,
        shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
            ...dbConfig,
            ...firebaseConfig,
            FIREBASE_AUTH_EMULATOR_HOST: process.env.FIREBASE_AUTH_EMULATOR_HOST,
            FIREBASE_USER_EMULATOR_HOST: process.env.FIREBASE_USER_EMULATOR_HOST,
        },
    },
    // import the function via paths
    functions: { create, getById, authenticate, findUsers, createGuestUser, deleteUser, populateJoinRequest },
    package: { individually: true },
    custom: {
        esbuild: {
            format: "esm",
            bundle: true,
            minify: true,
            sourcemap: true,
            sourcesContent: false,
            keepNames: false,
            outputFileExtension: '.mjs',
            exclude: ["aws-sdk"],
            target: "node18",
            define: { "require.resolve": undefined },
            platform: "node",
            concurrency: 10,
            banner: {
                // https://github.com/evanw/esbuild/issues/1921
                js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);",
            }
        },
        "serverless-offline": {
            httpPort: 6001,
            websocketPort: 6002,
            lambdaPort: 6003
        }
    },
};

module.exports = serverlessConfiguration;