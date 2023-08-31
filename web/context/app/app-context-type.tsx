import { User } from "next-auth";

type AppContextType = {
    companyName: string;
user: User | undefined;
locale: string;
domain: string;
tickets: any;
setTickets: (value:[] | undefined) => void;
};

export default AppContextType;