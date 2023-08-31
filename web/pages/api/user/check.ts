import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'
import {CognitoIdentityProviderClient, ListIdentityProvidersCommand} from '@aws-sdk/client-cognito-identity-provider';
import getDomain from "../../../utils/email";

type Data = {
    call: any;
    contacts: any;
    email: string | null |undefined;
    provider: string | null | undefined;
    changePasswordSupportUrl: string | null | undefined;
    forgetPasswordSupportUrl: string | null | undefined;
    unlockAccountSupportUrl: string | null | undefined;
    accountSupport: any;
    error: string | null | undefined;
}
export default async function GET(request: NextRequest)
{
    const token = request.cookies.get('token')
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email')
    const domain = getDomain(email);
    const provider = await checkProvider(domain);
    if( provider) {
        //Check client profile is Active
        //if (clientProfile?.isActive)
        NextResponse.json({
            accountSupport: 
        });

    }
    return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
    // FormData
    const formData = await request.formData();
    const name = formData.get('name')
  const email = formData.get('email')
    return new Response('Hello, Next.js!', {
        status: 200,
        headers: { 'Set-Cookie': `token=${token.value}` },
      })}

      const checkProvider =async (domain: string) => {
        const client = new CognitoIdentityProviderClient({region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.ACCOUNT_KEY!,
            secretAccessKey:process.env.ACCESS_SECRET!,
        }
    });
    const command = new ListIdentityProvidersCommand({UserPoolId: process.env.COGNITO_USER_POLL_ID,
    });
    const response = await client.send(command);
    return response.Providers?.find((e) => e.ProviderName?.toLowerCase() === domain.toLowerCase(),
    )?.ProviderName;
      };