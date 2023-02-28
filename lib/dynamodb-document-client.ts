import {DeleteItemCommandInput, DynamoDBClient, DynamoDBClientConfig, QueryCommand, ScanCommand, ScanCommandInput} from "@aws-sdk/client-dynamodb";
import {DeleteCommand, DynamoDBDocumentClient, PutCommand, PutCommandInput, QueryCommandInput, ScanCommandOutput, TranslateConfig} from "@aws-sdk/lib-dynamodb";
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

    public async query<T>(data: QueryCommandInput){
        const command = new QueryCommand(data);
        const results = await this.client.send(command) as Omit<ScanCommandOutput, 'Items'> & {Items?: Record<string, any>[]};
        const unmarshallResults = results.Items?.map((v,i) => unmarshall(v));
        results.Items = unmarshallResults;
        return results;
    }

    public async saveItem<T>(data: PutCommandInput) {
        const command = new PutCommand(data);
        const results = await this.ddbDocClient.send(command);
        return results;
    }

    public async deleteItem<T>(data: DeleteItemCommandInput) {
        const command = new DeleteCommand(data);
        const results =await this.ddbDocClient.send(command);
        return results;
    }

    public async scan<T>(data: ScanCommandInput) {
        let finalResults = new Array();
        let lastKeyEvaluated = null;

        try {

            //do {
                const results = await this.client.send(new ScanCommand(data)) as Omit<ScanCommandOutput, 'Items'> & {Items?: Record<string, any>[]} & {Items?: T[]};
                const {Items, LastEvaluatedKey} = results;
                lastKeyEvaluated = results.LastEvaluatedKey;
                const unmarshallResults = Items?.map((v,i) => unmarshall(v));
                unmarshallResults?.map((v,i) => finalResults.push(v));
                data.ExclusiveStartKey = LastEvaluatedKey;
            //} while (lastKeyEvaluated != null)
            return finalResults;

        } catch(e) {
            console.log(e);
            throw e;
        }
    }
}
export const documentClient = new DocumentDbClient();