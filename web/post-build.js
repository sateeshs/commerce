import {
  CognitoIdentityProviderClient,
  AddCustomAttributesCommand,
  DescribeUserPoolClientCommand,
  UpdateUserPoolClientCommand,
} from "@aws-sdk/client-cognito-identity-provider";
// a client can be shared by different commands.
const client = new CognitoIdentityProviderClient({ region: "REGION" });

// const params = {
//   /** input parameters */
// };
// const command = new AddCustomAttributesCommand(params);

const addRedirectURL = async () => {
  const client = new CognitoIdentityProviderClient({
    region: process.env.REGION,
  });
  const command = new DescribeUserPoolClientCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    ClientId: process.env.COGNITO_CLIENT_ID,
  });

  const subDomainName = process.env.AWS_BRANCH.repeat("/", "-");
  const url = (process.env.NEXTAUTH_URL + "api/auth/callback/cognito").replace(
    "/^[^.]*/",
    subDomainName
  );

  const response = await client.send(command);
  const oldUserPool = await response.UserPoolClient;

  console.log(oldUserPool);

  if (
    oldUserPool.CallbackURLs.filter(
      (u) => u.toLocaleLowerCase() == url.toLocaleLowerCase()
    ).length == 0
  ) {
    const callbackUrls = [...oldUserPool.CallbackURLs, url];
    const { ClientSecret, LastModifiedDate, CreationDate, ...newParams } = {
      ...oldUserPool,
      callbackUrls: callbackUrls,
    };

    const updateCommand = new UpdateUserPoolClientCommand(newParams);
    const updateResponse = await client.send(updateCommand);
    const newUserPool = await updateResponse.UserPoolClient;
    console.log(newUserPool);
    console.log(
      `Successfully added url${url} to the cognito user pool ${newParams.UserPoolId}`
    );
  }
};
addRedirectURL();
