import { useRouter } from "next/router";

import {useSession} from 'next-auth/react';
const Auth = ({children}:any) => {
const router = useRouter();
const {status} = useSession({required: true,
    onUnauthenticated(){
        router.push({
            pathname: '/login',
            query: {returnUrl: router.asPath}
        })
    }});
    if (status ==='loading') return <div>Loading</div>
return children;
}


export default Auth;