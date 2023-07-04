import { StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";

export interface LambdaStackProps extends StackProps {
    readonly functionName: string;
    readonly codePath: string;
    readonly runtime: lambda.Runtime
    readonly description: string;
    readonly handler: string;
    readonly memorySize: number;
    readonly timeout: any
}

export class LambdaConstruct extends Construct {
    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id);
    }
}