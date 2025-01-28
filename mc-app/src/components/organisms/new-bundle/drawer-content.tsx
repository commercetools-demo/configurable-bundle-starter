import React, { useState } from 'react';
import { Stepper } from './stepper';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import SelectBundleTypeStep from './steps/select-bundle-type-step';
import SelectProductStep from './steps/select-product-step';
import ReviewStep from './steps/review-step';
import styled from 'styled-components';
import { BundleFormikValues } from '../../molecules/add-new-bundle-button';
import BundleConfigurationStep from './steps/bundle-configuration-step';
import { useFormik } from 'formik';

type Formik = ReturnType<typeof useFormik>;

const StyledFormWrapper = styled.div`
  max-width: 2xl;
  margin: 0 auto;
  padding: 6;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

interface Props {
  values: BundleFormikValues;
  touched: Formik['touched'];
  errors: Formik['errors'];
  handleChange: Formik['handleChange'];
  handleBlur: Formik['handleBlur'];
}
const DrawerContent = ({
  handleBlur,
  handleChange,
  touched,
  values,
  errors,
}: Props) => {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SelectBundleTypeStep
            values={values}
            handleChange={handleChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <SelectProductStep
            values={values}
            handleChange={handleChange}
            errors={errors}
          />
        );
      case 3:
        return (
          <BundleConfigurationStep
            values={values}
            handleChange={handleChange}
            handleBlur={handleBlur}
            touched={touched}
            errors={errors}
          />
        );
      case 4:
        return <ReviewStep values={values} />;
      default:
        return null;
    }
  };

  return (
    <StyledFormWrapper>
      <Stepper currentStep={currentStep} />

      <StepWrapper>{renderCurrentStep()}</StepWrapper>

      {currentStep < 4 && (
        <ButtonContainer>
          <SecondaryButton
            onClick={prevStep}
            isDisabled={currentStep === 1}
            label="Back"
          >
            Back
          </SecondaryButton>
          <PrimaryButton label="Next" onClick={nextStep}>
            Next
          </PrimaryButton>
        </ButtonContainer>
      )}
    </StyledFormWrapper>
  );
};

export default DrawerContent;
