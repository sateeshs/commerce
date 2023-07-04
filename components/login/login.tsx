import { signIn } from "next-auth/react";
import { useState } from "react";

const Login = () => {
const [domain, setDomain] = useState(null);
    const signInClick = async (e: any) => {
        e.preventDefault();
        if(domain) {
            signIn('cognito', {}, {identity_provider: domain});
        }
    }
    return(<></>)
}