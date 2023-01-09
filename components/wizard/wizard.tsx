import { NextPage } from "next";
//import styles from "../../../styles/styles.module.scss";
import styles from "../../styles/styles.module.scss";
interface props {
    children: any, currentStep:any, prevFormStep:any
}
const WizardForm:NextPage<props> = ({  children, currentStep, prevFormStep}) =>{
    return (
        <div className={styles.formCard}>
          {currentStep < 3 && (
            <>
              {currentStep > 0 && (
                <button
                  className={styles.back}
                  onClick={prevFormStep}
                  type="button"
                >
                  Back
                </button>
              )}
    
              <span className={styles.steps}>Step {currentStep + 1} of 3</span>
            </>
          )}
          {children}
        </div>
      );
}
export default WizardForm;
//https://codesandbox.io/s/github/nefejames/unform-multi-step-form/tree/main/?file=/styles/styles.module.scss