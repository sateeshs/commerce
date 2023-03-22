import { createContext } from "react";
import clientWizardType from "./client-type";

const clientWizardTypeDefaultValue: clientWizardType = {
    data: {},
    clientId: '',
    setWizardFormValues: (values: any) => {},

    setClientIdValue: (values: any) => {}

}

const ClientWizardFormContext = createContext<clientWizardType>(clientWizardTypeDefaultValue);
export default ClientWizardFormContext;