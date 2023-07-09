import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as autoscaling from "aws-cdk-lib/aws-autoscaling";

export interface EcsClusterProps {
    name: string;
    vpc: ec2.Vpc
}
export class EcsClusterConstruct extends Construct {
    constructor(scope: Construct, id: string, props: EcsClusterProps) {
        super(scope, id);

        const asg = new autoscaling.AutoScalingGroup(this, 'MyFleet', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.XLARGE),
            machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
            desiredCapacity: 3,
            vpc: props.vpc,
          });

        const ecsCluster = new ecs.Cluster(scope,id, {vpc: props.vpc});
        const capacityProvider = new ecs.AsgCapacityProvider(this, 'AsgCapacityProvider', { autoScalingGroup: asg });
        ecsCluster.addAsgCapacityProvider(capacityProvider);
    }
}

/*
const app = new cdk.App();

new EcsClusterConstruct(app, 'MyFirstEcsCluster');

app.synth();
*/