import type { AWS } from '@serverless/typescript';

import getById from "./src/functions/getById";
import findUsers from "./src/functions/get";

import dbConfig from './src/config/db.config.json';
import firebaseConfig from './src/config/firebase.config.json';
import apiConfig from './src/config/api.config.json';

const serverlessConfiguration: AWS = {
    org: 'splitsies',
    app: 'user-service',
    service: 'user-service-private',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild', 'serverless-offline'],
    provider: {
        name: 'aws',
        runtime: 'nodejs18.x',
        stage: 'dev-pr',
        endpointType: "PRIVATE",
        vpcEndpointIds: [
            "vpce-07750704215897cd8"
        ],
        vpc: {
            securityGroupIds: [
                "sg-0c856a69027cbbe51",
                "sg-0f8a62286187fbab0"
            ],
            subnetIds: [
                "subnet-0301a21d6a9ca2e03"
            ]
        },
    
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
            resourcePolicy: [{
                Effect: "Allow",
                Principal: "*",
                Action: "execute-api:Invoke",
                Resource: "*",
                Condition: {
                    StringEquals: {
                        "aws:sourceVpc": "vpc-038fd3eb6a62e5c0f"
                    }
                }
            }]
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
            ...dbConfig,
            ...firebaseConfig,
            ...apiConfig
        },
    },
    // import the function via paths
    functions: { getById, findUsers },
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