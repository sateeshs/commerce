import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as  iam from 'aws-cdk-lib/aws-iam';

export interface UserRoleStackProps extends StackProps {
    lambdaArn: string;
    tableArn: string;
    bucketArn: string;
    policyName: string;
    roleName: string;
    userName: string;
}

export class UserRoleConstruct extends Construct {
    public readonly policy: iam.ManagedPolicy;
    public readonly role: iam.Role;
    public readonly user: iam.User;
    public readonly accessKey: iam.CfnAccessKey;

    constructor(scope: Construct, id: string, props: UserRoleStackProps) {
        super(scope, id);
        let account = Stack.of(this).account;
        let region = Stack.of(this).region;
        let policyObject = {
            statements: [
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions:['logs:CreateLogStream', 'logs:PutLogEvents'],
                    resources: [
                        `arn:aws:logs:${region}:${account}:log-group:/aws/amplify/*:log-stream:*`,
                        props.lambdaArn+ ':*',
                    ]
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions:['logs:CreateLogGroup'],
                    resources: [
                        `arn:aws:logs:${region}:${account}:log-group:/aws/amplify/*`,
                        props.lambdaArn,
                    ]
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions:['cognito-idp:*'],
                    resources: [
                        '*',
                    ]
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions:['cognito-identity:*'],
                    resources: [
                        '*',
                    ]
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions:['dynamodb:*'],
                    resources: [
                        props.tableArn
                    ]
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions:['s3:*'],
                    resources: [
                        `${props.bucketArn}/*`,
                    ]
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions:['lambda:InvokeFunction'],
                    resources: [props.lambdaArn, props.lambdaArn+ ':*']
                }),
            ]
        };
        this.policy = new iam.ManagedPolicy(this, props.policyName, {
            managedPolicyName: props.policyName,
            ...policyObject,
        });

        // Create the service Role
        this.role = new iam.Role(this, props.roleName, {
            roleName: props.roleName,
            assumedBy: new iam.ServicePrincipal('amplify.amazonaws.com'),
            description: 'Custom role permitting resources creation from Amplify',
            managedPolicies: [this.policy]
        });

        // Create a new user and assign the role above
        const user = new iam.User(this, props.userName, {
            userName: props.userName,
            managedPolicies: [this.policy],
        });

        this.accessKey = new iam.CfnAccessKey(this, 'CfnAccessKey', {
            userName: user.userName,
        })
    }

}