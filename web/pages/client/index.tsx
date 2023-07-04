import { NextPage } from "next";
import { ReactNode, useState } from "react";
import PersonalInfo from "../../components/wizard/personalInfo";
import WizardForm from "../../components/wizard/wizard";
import ClientWizardFormProvider from "../../context/wizard-state";

interface Props {
    data: any
}

const Client: NextPage<Props> =({}) =>{

    const [formStep, setFormStep] = useState(0);

  
  const nextFormStep = () => setFormStep((currentStep) => currentStep + 1);

  const prevFormStep = () => setFormStep((currentStep) => currentStep - 1);


    return(<>
        <ClientWizardFormProvider>
        <WizardForm currentStep={formStep} prevFormStep={prevFormStep}>
        <PersonalInfo formStep={formStep} nextFormStep={nextFormStep} />
        
        </WizardForm>
        </ClientWizardFormProvider>
        </>)
};

export default Client;