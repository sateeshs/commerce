// CloudWorkDashBoard Construct
import { Construct, } from 'constructs';
import { StackProps, Duration, CfnOutput } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as rds from 'aws-cdk-lib/aws-rds';

export interface CloudWatchDashboardProps extends StackProps {
    readonly projectName: string;
    readonly dbCluster: rds.DatabaseCluster;
}

export class CloudWatchDashboardConstruct extends Construct {
    constructor(scope: Construct, id: string, props: CloudWatchDashboardProps) {
        super(scope, id);
        const projectName = props.projectName;
        const dbCluster = props.dbCluster;

        const dashboard = new cloudwatch.Dashboard(this, 'Dashboard', {
            dashboardName: projectName + '-dashboard'
        });
    }
}