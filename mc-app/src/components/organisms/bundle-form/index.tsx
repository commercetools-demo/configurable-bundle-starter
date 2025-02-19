import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import { FormModalPage } from '@commercetools-frontend/application-components';
import DrawerContent from '../new-bundle/drawer-content';
import { BundleFormikValues } from '../../molecules/add-new-bundle-button';
import { useCloseModalConfirmation } from '../../../hooks/use-close-modal-confirmation';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import styled from 'styled-components';
import { AngleLeftIcon, AngleRightIcon } from '@commercetools-uikit/icons';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #e5e7eb;
  padding: 1rem;
  --color-primary-25: 'black',

`;

interface BundleFormProps {
  initialValues: BundleFormikValues;
  isModalOpen: boolean;
  closeModal: () => void;
  onSubmit: (values: BundleFormikValues) => Promise<void>;
}

const BundleForm: React.FC<React.PropsWithChildren<BundleFormProps>> = ({
  initialValues,
  isModalOpen,
  children,
  closeModal,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const { ConfirmationModal, showConfirmationModal } =
    useCloseModalConfirmation();
  return (
    <Formik<BundleFormikValues>
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({
        values,
        isValid,
        errors,
        dirty,
        touched,
        isSubmitting,
        resetForm,
        handleChange,
        handleBlur,
        submitForm,
        setFieldValue,
      }) => (
        <>
          {children}
          <Form>
            <FormModalPage
              isOpen={isModalOpen}
              title="Add new bundle"
              isPrimaryButtonDisabled={
                isSubmitting || !dirty || !isValid || currentStep !== 4
              }
              isSecondaryButtonDisabled={isSubmitting}
              onPrimaryButtonClick={submitForm}
              onSecondaryButtonClick={() =>
                showConfirmationModal(dirty, closeModal)
              }
              onClose={closeModal}
            >
              <DrawerContent
                currentStep={currentStep}
                nextStep={nextStep}
                prevStep={prevStep}
                setFieldValue={setFieldValue}
                handleChange={handleChange}
                handleBlur={handleBlur}
                touched={touched}
                values={values}
                errors={errors}
              />
              <ButtonContainer>
                <SecondaryButton
                  onClick={prevStep}
                  isDisabled={currentStep === 1}
                  label="Back"
                  tone='secondary'
                  iconLeft={
                    <AngleLeftIcon
                    size='small'
                    />
                  }
                >
                  Back
                </SecondaryButton>
                {currentStep < 4 && (
                  <PrimaryButton label="Next" onClick={nextStep}
                    iconRight={
                      <AngleRightIcon
                        size='small'
                      />
                    }
                  >
                    Next
                  </PrimaryButton>
                )}
              </ButtonContainer>
            </FormModalPage>
            <ConfirmationModal
              onCloseConfirmation={() => {
                resetForm();
                closeModal();
              }}
            />
          </Form>
        </>
      )}
    </Formik>
  );
};

export default BundleForm;
