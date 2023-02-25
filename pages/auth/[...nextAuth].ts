
import NextAuth from 'next-auth/next';
import { OAuthUserConfig } from 'next-auth/providers';
import CognitoProvider, { CognitoProfile } from 'next-auth/providers/cognito';

const options: OAuthUserConfig<CognitoProfile>  = {
        clientId: process.env.COGNITO_CLIENT_ID!,
        clientSecret: process.env.COGNITO_CLIENT_SECRET!,
        issuer: process.env.COGNITO_ISSUER,
};
export const authOptions = {
    providers: [CognitoProvider(options)],
    secret: process.env.NEXTAUTH_SECRET,
    site: process.env.NEXTAUTH_URL,
}
export default NextAuth(authOptions);