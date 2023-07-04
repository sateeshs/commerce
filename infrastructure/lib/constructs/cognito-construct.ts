import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cognito from "aws-cdk-lib/aws-cognito";
import path = require('path');
export interface UserPoolStackProps extends StackProps {
    readonly functionName: string;
    readonly userPoolName: string;
    readonly tableName: string;
}

export class CognitoConstruct extends Construct {
    public readonly userPool: cognito.UserPool;
    public readonly preTokenLambda: lambda.Function;
    public readonly userPoolClient: cognito.UserPoolClient;

    constructor(scope: Construct, id: string, props: UserPoolStackProps) {
        super(scope, id);
        //let account = Stack.of(this).account;
        //let region = Stack.of(this).region;

        const fetchLayer = new lambda.LayerVersion(this,'lambda-function-layer', {
            layerVersionName: `${props.userPoolName} node-fetch`,
            compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
            code: lambda.Code.fromAsset('src/layers/fetch--token-layer.zip'),
            description: 'node fetch',
        });

        // Create a pre-fetch-token lambda
        this.preTokenLambda = new lambda.Function(this, 'lambda-function', {
            functionName: props.functionName,
            description: 'pre-token-generator lambda',
            runtime: lambda.Runtime.NODEJS_18_X,
            memorySize: 128,
            timeout: Duration.seconds(3),
            handler: 'pre-token-generator.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda')),
            environment: {
                TABLE_NAME: props.tableName
            },
            layers:[fetchLayer],
            role: undefined
        });

        // Create user Pool
        this.userPool = new cognito.UserPool(this, 'userpool', {
            userPoolName: props.userPoolName,
            selfSignUpEnabled: false,
            signInAliases: {
                username: true,
            },
            autoVerify: {
                email: true,
            },
            signInCaseSensitive: false,
            lambdaTriggers: { preTokenGeneration: this.preTokenLambda},
            removalPolicy: RemovalPolicy.DESTROY
        });

        const standardCognitoAttributes = {
            email: true,
            familyName: true,
            givenName: true,
            name: true,
            phoneNumber: true,
        };
        const clientReadAttributes = new cognito.ClientAttributes().withStandardAttributes(standardCognitoAttributes);
        const clientWriteAttributes = new cognito.ClientAttributes().withStandardAttributes(standardCognitoAttributes);

        // user pool client
        this.userPoolClient = new cognito.UserPoolClient(this, 'userpool-client', {
            userPoolClientName: `${props.userPoolName}-client`,
            userPool: this.userPool,
            supportedIdentityProviders: [],
            accessTokenValidity: Duration.minutes(5),
            idTokenValidity: Duration.minutes(5),
            authSessionValidity: Duration.minutes(5),
            generateSecret: true,
            authFlows: {
                userPassword: true,
                userSrp: true,
                custom: true,
            },
            //allowedOAuthScopes: ['email', 'openid', 'phone', 'profile'],
//             callbackUrls: [
// 'http://localhost:3000/api/auth/callback/cognito',
// 'https://myapp.com/api/auth/callback/cognito'
//             ],
            readAttributes: clientReadAttributes,
            writeAttributes: clientWriteAttributes,
        });
    }
}