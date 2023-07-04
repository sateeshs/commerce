import { RemovalPolicy, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export interface DatabaseStackProps extends StackProps {
    tableName: string;
}

export class DynamodbConstruct extends Construct {
    public readonly table: dynamodb.Table;
    constructor(scope: Construct, id: string, props: DatabaseStackProps) {
        super(scope, id);
        this.table = new dynamodb.Table(this, props.tableName, {
            tableName: props.tableName,
            partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING},
            sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING},
            billingMode: dynamodb.BillingMode.PROVISIONED,
            readCapacity: 30,
            writeCapacity:10,
            removalPolicy: RemovalPolicy.DESTROY,
            pointInTimeRecovery: false,
            tableClass: dynamodb.TableClass.STANDARD,
        });

        this.table.addGlobalSecondaryIndex({
            indexName: 'pk-index',
            partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING},
            sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING},
            projectionType: dynamodb.ProjectionType.KEYS_ONLY
        });
    }
}