import React from 'react';
import { Form, Formik } from 'formik';
import { FormModalPage } from '@commercetools-frontend/application-components';
import DrawerContent from '../new-bundle/drawer-content';
import { BundleFormikValues } from '../../molecules/add-new-bundle-button';
import { useCloseModalConfirmation } from '../../../hooks/use-close-modal-confirmation';

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
              isPrimaryButtonDisabled={isSubmitting || !dirty || !isValid}
              isSecondaryButtonDisabled={isSubmitting}
              onPrimaryButtonClick={submitForm}
              onSecondaryButtonClick={() =>
                showConfirmationModal(dirty, closeModal)
              }
              onClose={closeModal}
            >
              <DrawerContent
                setFieldValue={setFieldValue}
                handleChange={handleChange}
                handleBlur={handleBlur}
                touched={touched}
                values={values}
                errors={errors}
              />
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
