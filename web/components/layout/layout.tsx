import { NextPage } from "next"
import { useSession } from "next-auth/react";
import React from "react";
import NavBar from "../navbar/navbar";

interface props {
    children: any
}
const Layout: NextPage<props> = ({children}) => {
    const {data: session, status} = useSession({ required: false});
    if(typeof window !== 'undefined') {
        if (session == null ){
            window.location.replace('/login');
        }
    }
    const setBlur = (show: boolean, c: any) => {

    }
return(<div>
    <NavBar blurCallback={setBlur}  />
    <div>
        {
            React.cloneElement(children, { session: session, setBlur: setBlur})
        }
    </div>
</div>);
}
export default Layout;