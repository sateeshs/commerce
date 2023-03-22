import { ReactNode, useState } from "react"
import ClientWizardFormContext from "./client-context";

export function useClientWizard() {

}

type Props = {
    children: ReactNode;
}

const AddClientWizardFormProvider = ({children}: Props) => {
    const [data, setData] = useState({});
    const [clientId, setClientId] = useState('');
    const setClientIdValue = (value: string) => {
        setClientId(value);
    };
    const setWizardFormValues = (values: any) => {
        setData((prevValues) => ({...prevValues, ...values}));
    };

    return (<ClientWizardFormContext.Provider value={{data, setWizardFormValues,
    clientId, setClientIdValue}}>{children}</ClientWizardFormContext.Provider>);
}