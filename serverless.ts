import type { AWS } from '@serverless/typescript';

import create from '@functions/create';

import dbConfig from 'src/config/db.config.json';

const serverlessConfiguration: AWS = {
    org: 'splitsies',
    app: 'user-service',
    service: 'user-service',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild', 'serverless-offline'],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        stage: 'dev-pr',
        apiGateway: {
        minimumCompressionSize: 1024,
        shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
            ...dbConfig
        },
    },
    // import the function via paths
    functions: { create },
    package: { individually: true },
    custom: {
        esbuild: {
        bundle: true,
        minify: false,
        sourcemap: true,
        exclude: ['aws-sdk'],
        target: 'node14',
        define: { 'require.resolve': undefined },
        platform: 'node',
        concurrency: 10,
        },
        "serverless-offline": {
            httpPort: 6001,
            websocketPort: 6002,
            lambdaPort: 6003
        }
    },
};

module.exports = serverlessConfiguration;