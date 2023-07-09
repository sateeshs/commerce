/**
 * Add environment variable from branch to amplify
 * node src/scripts/updateApp.mjs
 */
import * as dotenv from 'dotenv-flow';
import * as fs from "fs";
import { exec } from "child_process";
import outputs from "../../output-onyhs.json" assert { type: "json" };
import * as readline from 'readline';
import path from 'path';
import { fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname =path.dirname(__filename);

function askQuestion(query) {
    const url = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => url.question(query, (ans) => {
        url.close();
        resolve(ans);
    }),);
}

dotenv.load([path.resolve(__dirname, `../../.env`)]);
const region = process.env.REGION;
const profile = await askQuestion('aws profile: ');
const appId = await askQuestion('amplify appId: ');
const outputVars = outputs[Object.keys(outputs)[0]];

const outputvars = {
    COGNITO_CLIENT_ID: outputVars.cognitoClientId,
    COGNITO_CLIENT_SECRET: outputVars.cognitoClientSecret,
    ACCESS_KEY: outputVars.accessKey,
    ACCESS_SECRET: outputVars.accessSecret,
    S3_BUCKET_URL: outputVars.s3BucketUrl,
    S3_BUCKET: outputVars.s3Bucket,
    CONNECT_TABLE: outputVars.connectTable,
    NEXTAUTH_SECRET: 'onyhs',
    REGION: region,
    COGNITO_USER_POOL_ID: outputVars.userPoolId,
    COGNITO_ISSUER: `https://cognito-idp.${process.env.REGION}.amazonaws.com/${outputVars.userPoolId}`,
    NEXTAUTH_URL: `https://dev.${appId}.amplifyapp.com/`,
}

const varsToString = (vars, separator = ',') => {
    return Object.entries(vars)
            .map(([k, v], i) => `${k}=${v}`)
            .join(separator);
};
const varString = varsToString(outputvars);

const res = exec(
    `aws amplify update-app --profile '${profile}'  --app-id '${appId}'  --environment-variables '${varString}' --region '${region}'`,
    function (error, stdout, stdErr) {
        console.log(`stdOut: ${stdout}`);
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    }
);

let devVars = {};

['dev', 'test', 'uat', 'main'].forEach((branch) => {
    dotenv.load([path.resolve(__dirname, `../../.env.${branch}`)]);

    const variables = {
TWILIO_CHAT_ACCOUNT: process.env.TWILIO_CHAT_ACCOUNT,
TWILIO_CHAT_FLOW: process.env.TWILIO_CHAT_FLOW,
TWILIO_CHAT_STATUS_LINK: process.env.TWILIO_CHAT_STATUS_LINK,
NEXTAUTH_URL: `httos://${branch}.${appId}.amplifyapp.com/`
    };
    console.log(variables);

    if (branch === 'dev') {
        devVars = variables;
    }

    const varString = varsToString(variables, ',');

    const res = exec(
        `aws amplify update-branch --branch-name ${branch} --profile '${profile}'  --app-id '${appId}'  --environment-variables '${varString}' --region '${region}'`,
        function (error, stdout, stdErr) {
            console.log(`stdOut: ${stdout}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        }
    );
    dotenv.unload([path.resolve(__dirname, `../../.env.${branch}`)]);
});


devVars.NEXTAUTH_URL = `http://localhost:3000`;
const envStrings = varsToString({ ...outputVars, ...devVars}, '\n');
fs.writeFileSync('.env.local', envStrings);

console.log('done.');


