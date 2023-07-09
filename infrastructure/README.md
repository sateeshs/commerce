# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

`amplifyAppId: App Settings >> general >> app arn >> last 14 alphaNumeric
node src/seripts/updateApp.mjs
node sec/scripts/addIdp.mjs <domain> to add saml identity provider to user pool and client
`

## Samples

```markdown
(cdk-nextjs)[https://github.com/sateeshs/cdk-compliant-aurora-nextjs/tree/main/lib/constructs]
(AML2)[https://support.okta.com/help/s/article/How-to-create-a-basic-custom-SAML-application-using-SP-metadata-file?language=en_US]
(SAML ToolKit)[https://www.samltool.com/sp_metadata.php]
(idp)[https://lazypandatech.com/blog/AWS/6/SSO-configuration-using-AWS-Cognito-ForgeRock---OpenAM-with-SAML-Assertion/]
(third party saml)[https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_saml_3rd-party.html]
(dotnet-layer)[https://milangatyas.com/Blog/Detail/1/managing-net-core-aws-lambda-with-typescript]
(cdk-ec2)[https://github.com/sateeshs/aws-cdk-examples/blob/master/typescript/ec2-instance/lib/ec2-cdk-stack.ts]
```
