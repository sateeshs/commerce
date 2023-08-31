import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface LoginShape {
    call: any;
    contacts: any;
    changePassword: string;
    forgotPassword: string;
    unlockAccount: string;
    accountSupport: any;
    provider: string;
}

const Login: NextPage = (props: any) => {
    const router = useRouter();
    const {data: session, status} = useSession();
    const checkProvider = async (formData: any) => {
        const response = await fetch(`/api/user/check?email=${formData.email}`);
        const data = await response.json();
    }
    const onSubmit =async (data: any) => {
        try{
const provider = getValues('provider')
if (provider) {
    const returnUrl = router.query && 
signIn('cognito',{callbackUrl: returnUrl}, {identity_provider: provider});
}

        }catch(e)
        {

        }
    }
    return (<></>)
}