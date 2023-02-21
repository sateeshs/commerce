import {DynamoDBClient, DynamoDBClientConfig} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, QueryCommandInput, TranslateConfig} from "@aws-sdk/lib-dynamodb";
import {unmarshall} from "@aws-sdk/util-dynamodb";

class DocumentDbClient {

    private client = new DynamoDBClient(<DynamoDBClientConfig>{
        accessKeyId: process.env.DYNAMO_ACCESS_KEY,
        secretAccessKey: process.env.DYNAMO_SECRET_KEY,
        region: process.env.DYNAMO_REGION
    });

    private marshallOptions = {convertEmptyValues: false, removeUndefinedValues: false, convertClassInstanceToMap: false};
    private unMarshallOptions ={wrapNumbers: false};
    private translateConfig = <TranslateConfig>{marshallOptions: this.marshallOptions, unmarshallOptions: this.unMarshallOptions};

    public ddbDocClient = DynamoDBDocumentClient.from(this.client, this.translateConfig);

    public async query<T>(data: QueryCommandInput)
}