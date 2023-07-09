import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib"; 
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns"
export interface FargateAutoScalProps {
    //vpc: ec2.Vpc;
    subnetId: string;
    cluster:  ecs.Cluster
}

export class AutoScalingFargateService extends Construct {
    constructor(scope: Construct, id: string, props: FargateAutoScalProps) {
        super(scope, id);
        // Create Fargate Service
        const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'onyhas-app', {
            cluster: props.cluster,
            cpu:512, // default is 256
            desiredCount: 6, // default is 1
            memoryLimitMiB:2048, //default is 512
            redirectHTTP: true,
            taskImageOptions: {
              image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-onyhs-sample")
            },
            taskSubnets: {subnets: [ec2.Subnet.fromSubnetId(scope, id, props.subnetId)]}
            //taskSubnets: {subnets: [{subnetId: ec2.Subnet.fromSubnetId(scope, props.subnetId)}]}
          });
    // const fargateService = new ecs_patterns.NetworkLoadBalancedFargateService(this, 'onyhas-app', {
    //     cluster: props.cluster,
    //     taskImageOptions: {
    //       image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-onyhs-sample")
    //     },
    //   });
  
      // Setup AutoScaling policy
      const scaling = fargateService.service.autoScaleTaskCount({ maxCapacity: 2 });
      scaling.scaleOnCpuUtilization('CpuScaling', {
        targetUtilizationPercent: 50,
        scaleInCooldown: cdk.Duration.seconds(60),
        scaleOutCooldown: cdk.Duration.seconds(60)
      });
  
      new cdk.CfnOutput(this, 'LoadBalancerDNS', { value: fargateService.loadBalancer.loadBalancerDnsName });
      new cdk.CfnOutput(this, 'Service', { value: fargateService.service.serviceName });

    }
}

/*
const app = new cdk.App();

new AutoScalingFargateService(app, 'aws-fargate-application-autoscaling');

app.synth();
*/