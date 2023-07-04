/**
 * node src/scripts/addIdp.mj <domain> to add SAML identity providers to the user pool and client.
 * if there is any update first remove from idp and run the script.
 */
import "dotenv/config";
import * as fs from "fs";
import { exec } from "child_process";
import outputs from "../../output-onyhs.json" assert { type: "json" };

const region = process.env.REGION;

const outputVars = outputs[Object.keys(outputs)[0]];
const userPoolId = outputVars.userPoolId;
const clientId = outputVars.cognitoClientId;

const domains = process.argv.slice(2);

// IDP
// add new customers saml manually in future if requirements comes in
let idps = [];
const samlFolder = "src/saml/";
domains.forEach((domain) => {
  const fileContent = fs
    .readFileSync(`${samlFolder}${domain}.xml`, "utf8")
    .replaceAll('"', '\\"')
    .replaceAll("\n", " ");

  const res2 = exec(
    `aws cognito-idp create-identity-provider --profile shared --region '${region}' --user-pool-id ${userPoolId} --provider-name=${domain} --provider-type SAML --provider-details '{"MetadataFile":"${fileContent}"}' --attribute-mapping "email=emailAddress,familyName=lastName,givenName=firstName,phoneNumber=phoneNumber,name=firstName"`,
    function (error, stdout, stderr) {
      console.log("stdout create-idp: ", stdout);
      if (error !== null) {
        console.log(`exec error create-idp: ${error}`);
        process.exit();
      }
    }
  );
  idps.push(domain);
});

const res2 = exec(
  `aws cognito-idp describe-user-pool-client --profile shared --region ${region} --user-pool-id "${userPoolId}" --client-id "${clientId}"`,
  function (error, stdout, stderr) {
    console.log("stdout describe userpool: ", stdout);
    let describePool = JSON.parse(stdout).UserPoolClient;

    const supportedIdps = [
      ...(describePool.SupportedIdentityProviders ?? []),
      ...idps,
    ]
      .map((i) => `"${i}"`)
      .join(" ");

    const CallbackUrls = describePool.CallbackUrls.map((i) => `"${i}"`).join(
      ","
    );

    const res3 = exec(
      `aws cognito-idp update-user-pool-client --user-pool-id "${userPoolId}" --profile shares --client-id "${clientId}" --supported-identity-providers ${supportedIdps} --callback-urls '[${CallbackUrls}]' --read-attributes "email" "family_name" "given_name" "phone_number" "name" --write-attributes "email" "family_name" "given_name" "phone_number" "name" --allowed-o-auth-flows code --allowed-o-auth-scopes '["email", "openid", "phone", "profile"]' --allowed-o-auth-flows-user-pool-client`,
      function (error, stdout, stderr) {
        console.log(`stdout: update client ${stdout}`);
        if (error !== null) {
          console.log(`exec error update client: ${error}`);
          process.exit();
        }
      }
    );

    if (error !== null) {
      console.log(`exec error describe pool: ${error}`);
      process.exit();
    }
  }
);
