import { ReactNode, useContext, useState } from "react"
import ClientWizardFormProvider from "../wizard-state";
import ClientWizardFormContext from "./client-context";

export function useClientWizard() {

}

type Props = {
    children: ReactNode;
}
// implement AddClientWizardFormProvider in tsx page 
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
export default ClientWizardFormProvider;
export const useClientFormData= () => useContext(ClientWizardFormContext)