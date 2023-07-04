import { LexRuntimeV2Client, RecognizeTextCommand } from "@aws-sdk/client-lex-runtime-v2";

export const handler = async (event, context, callback) => {
const config = {
    region: process.env.AWS-REGION
}
const {customerMessage, sessionId} = event.body;
const {botId, botAliasId, FLEX_WORKFLOW_SID } = event.body.pre_engagement_data;
//Send message to AWS LEX
const client = new LexRuntimeV2Client(config);
const recognizeTextCommand = new RecognizeTextCommand({
    botId,
    botAliasId,
    sessionId: sessionId,
    text: customerMessage,
    localeId: 'en_US'
});
const response = await client.send(recognizeTextCommand);
}