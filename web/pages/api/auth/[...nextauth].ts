import { OAuthUserConfig } from "next-auth/providers";
import CognitoProvider, {CognitoProfile} from 'next-auth/providers/cognito';
import { parseJwt } from "../../../utils";
import NextAuth from "next-auth";
const options: OAuthUserConfig<CognitoProfile> = {
    clientId: process.env.COGNITO_CLIENT_ID!,
    clientSecret:process.env.COGNITO_CLIENT_SECRET!,
    issuer: process.env.COGNITO_ISSUER,
    checks: 'nonce'
};
export const authOptions = {
    providers: [CognitoProvider(options)],
    secret: process.env.NEXTAUTH_SECRET,
    site: process.env.NEXTAUTH_URL,
    pages: {
        signIn: '/login'
    },
    session: {maxAge: 5 * 60 * 60},
    JWT: {
        maxAge: 5*60*60,
    },
    callbacks: {
        async jwt({token, account}: any) {
console.log('info', JSON.stringify(account))
if (account) {
    const { isSuperAdmin, family_name} = parseJwt(account.id_token);
    token.isSuperAdmin = isSuperAdmin;
    token.familyName = family_name;
}
return token;
        },
        async session({session, token}: any) {
            session.user.isSuperAdmin = token.isSuperAdmin;
            session.user.lastName = token.familyName;
            return session;
        }
    }
};
export default NextAuth(authOptions);