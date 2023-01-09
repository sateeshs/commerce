import { useState, createContext, useContext, ReactNode } from "react";

type clientWizardType= {
  data: any,
// current: number,
// prevous: number,
// next: number
close: () => void
setFormValues: (value: any) => void,

} 

const clientWizardTypeDefaultValue: clientWizardType = {
  data: {},
// current: 0,
// prevous: -1,
// next: -1,
close: () =>{},
setFormValues: (value: any) => {},
} 

 const ClientWizardFormContext = createContext<clientWizardType>(clientWizardTypeDefaultValue);
//export default ClientWizardFormContext;
export function useClientWizard() {
    return useContext(ClientWizardFormContext);
}

type Props = {
    children: ReactNode;
};



const  ClientWizardFormProvider = ({ children }:Props) => {
    const [data, setData] = useState({});
  
    const close = () =>{}
    const setFormValues = (values:any) => {
      setData((prevValues) => ({
        ...prevValues,
        ...values,
      }));
    };
    // const value = {
    //     data,
    //     close,
    // };
    return (
        <ClientWizardFormContext.Provider value={{ data, close, setFormValues }}>
        {children}
      </ClientWizardFormContext.Provider>
      
            );
  }
  export default ClientWizardFormProvider;
  export const useFormData = () => useContext(ClientWizardFormContext);