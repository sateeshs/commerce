import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import {Role, ServicePrincipal, PolicyStatement, Effect, IRole} from "aws-cdk-lib/aws-iam";
import * as logs from 'aws-cdk-lib/aws-logs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigwv2Alpha from '@aws-cdk/aws-apigatewayv2-alpha';
import * as apigwv2Integration from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as apigwv2Authorization from '@aws-cdk/aws-apigatewayv2-authorizers-alpha';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as cognito from 'aws-cdk-lib/aws-cognito';
export interface ApiGatewayCognitoNLBFargateProps {
    readonly resourcePrefix: string;
    readonly vpcId: string;
    readonly logGroupName: string;
    readonly repositoryArn: string;
    readonly image: string;
    readonly containerPort: number,
    readonly minCapacity: number,
    readonly maxCapacity: number,
    readonly nlbListenerPort: number,
    readonly cognitoUserPoolArn: string,
}

export class ApiGatewayCognitoNlbFargate extends Construct {
    constructor(scope: Construct, id: string, props: ApiGatewayCognitoNLBFargateProps) {
        super(scope, id);
        
        const vpc = ec2.Vpc.fromLookup(this, `${props.resourcePrefix}-vpc`, {
            vpcId: props.vpcId
        });

        const lg = logs.LogGroup.fromLogGroupName(this, `${props.resourcePrefix}-api-log-group`, props.logGroupName);

        const log = new ecs.AwsLogDriver({
            logGroup: lg ? lg : new logs.LogGroup(this, `${props.resourcePrefix}-api-log-group`, {
                logGroupName: props.logGroupName,
                retention: logs.RetentionDays.ONE_WEEK
            }),
            streamPrefix: 'ecs'
        });
        
        const getExecutionRole = (log: logs.ILogGroup, repositoryName: string): IRole => {
            const executionRole = new Role(this, 'onyhs-ecs-execution-role', {
                roleName: 'onyhs-ecs-execution-role',
                assumedBy: new ServicePrincipal('ecs-taskd.amazonaws.com')
            });
            executionRole.addToPolicy(new PolicyStatement({actions:[
                "ecr:BatchCheckLayerAvailability",
                "ecr:BatchGetImage",
                "ecr:GetDownloadUrlForLayer"
            ],
            effect: Effect.ALLOW,
            resources: [repositoryName]}));
            
            executionRole.addToPolicy(new PolicyStatement({actions:[
                "ecr:GetAuthorizationToken"
            ],
            effect: Effect.ALLOW,
            resources: ['*']}));

            executionRole.addToPolicy(new PolicyStatement({actions:[
                "logs:CreateLogStream",
                "logs:PutLogEvents"

            ],
            effect: Effect.ALLOW,
            resources: [lg.logGroupArn] // Later change to loggroup
        }));
        return executionRole;
        }

        const executionRole = getExecutionRole(lg, props.repositoryArn);
        
        // Create a task role for connecting to s3/dv etc.
        const taskRole = new Role(this, `${props.resourcePrefix}-ecs-task-role`, {
            roleName: `${props.resourcePrefix}-ecs-task-role`,
            assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com')
        });

        // Create a task definition
        const taskDef = new ecs.FargateTaskDefinition(this, `${props.resourcePrefix}-api-task-def`,{
            memoryLimitMiB: 512,
            cpu:256,
            executionRole: executionRole,
            taskRole: taskRole
        });

        // Add container to task
        const container = taskDef.addContainer(`${props.resourcePrefix}-api-container`,{
            image: ecs.ContainerImage.fromRegistry(props.image),
            logging: log
        });

        container.addPortMappings({
            containerPort: props.containerPort,
            protocol: ecs.Protocol.TCP
        });

        // Create a cluster
        const cluster = new ecs.Cluster(this, `${props.resourcePrefix}-api-cluster`, {vpc, clusterName: `${props.resourcePrefix}-api-cluster`});

        // Create your own security group using VPC
        const secGroup = new ec2.SecurityGroup(this, `${props.resourcePrefix}-api-service-sg`, {
            securityGroupName: `${props.resourcePrefix}-api-service-sg`,
            vpc: vpc,
            allowAllOutbound: true
        });

        // Allow all traffic with in VPC
        secGroup.addIngressRule(ec2.Peer.ipv4(vpc.vpcCidrBlock), ec2.Port.tcp(props.containerPort));

        // Create a Fargate service
        const fargateService = new ecs.FargateService(this, `${props.resourcePrefix}-api-service`, {
            cluster,
            taskDefinition: taskDef,
            desiredCount: 1,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
            },
            assignPublicIp: false,
            serviceName: `${props.resourcePrefix}-api-service`,
            securityGroups: [secGroup]
        });

        const autoScalingGroup = fargateService.autoScaleTaskCount({minCapacity: props.minCapacity, maxCapacity: props.maxCapacity});
        autoScalingGroup.scaleOnCpuUtilization('CpuScaling', {
            targetUtilizationPercent: 50,
            scaleInCooldown: cdk.Duration.seconds(60),
            scaleOutCooldown: cdk.Duration.seconds(60)
        });

        const nlb = new elbv2.NetworkLoadBalancer(this, `${props.resourcePrefix}-backend-nlb`, {
            loadBalancerName: `${props.resourcePrefix}-backend-nlb`,
            vpc,
            internetFacing: false,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
            }
        });

        // Add a listener on a particular port for the NLB
        const listener = nlb.addListener(`${props.resourcePrefix}-api-listener`, {
            port: props.nlbListenerPort
        });

        // Add fargate service to listener
        listener.addTargets(`${props.resourcePrefix}-api-tg`, {
            targetGroupName: `${props.resourcePrefix}-api-tg`,
            port: props.containerPort,
            targets: [fargateService],
            deregistrationDelay: cdk.Duration.seconds(300)
        });

        const onyhsVpcLink = new apigwv2Alpha.VpcLink(this, `${props.resourcePrefix}-api-vpclink`, {
            vpc,
            subnets: {
                subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
            },
            securityGroups: [secGroup]
        });

        const httpApi = new apigwv2Alpha.HttpApi(this, `${props.resourcePrefix}-api`, {
            description: `${props.resourcePrefix} API`,
            corsPreflight: {
                allowHeaders: [
                    'Content-Type',
                    'X-Amz-Date',
                    'Authorization',
                    'X-Api-key',
                ],
                allowMethods: [
                    apigwv2Alpha.CorsHttpMethod.OPTIONS,
                    apigwv2Alpha.CorsHttpMethod.GET,
                    apigwv2Alpha.CorsHttpMethod.POST,
                    apigwv2Alpha.CorsHttpMethod.PUT,
                    apigwv2Alpha.CorsHttpMethod.PATCH,
                    apigwv2Alpha.CorsHttpMethod.DELETE,
                ],
                allowCredentials: true,
                //allowOrigins: ['http://localhost:3000']
            }
        });

        const userPool = cognito.UserPool.fromUserPoolArn(this, `${props.resourcePrefix}-userpool`, props.cognitoUserPoolArn);
        const authorizer = new apigwv2Authorization.HttpUserPoolAuthorizer(`${props.resourcePrefix}-api-authorizer`, userPool);
        httpApi.addRoutes({
            path: '/{proxy+}',
            methods: [apigwv2Alpha.HttpMethod.ANY],
            integration: new apigwv2Integration.HttpNlbIntegration('onyhs-nlb-integration', listener, {
                vpcLink: onyhsVpcLink 
            }),
            authorizer: authorizer
        });

        new cdk.CfnOutput(this, 'Url', {
            value: httpApi.url ?? 'Something went wrong'
        });
    }

    // getExecutionRole.addToPolicy(new PolicyStatement({
    //     actions:[
    //         "ecr:BatchCheckLayerAvailability",
    //         "ecr:BatchGetImage",
    //         "ecr:GetDownloadUrlForLayer"
    //     ],
    //     effect: Effect.ALLOW,
    //     resources: [repositoryName]
    // }));
}