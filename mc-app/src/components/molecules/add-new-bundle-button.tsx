import PrimaryButton from '@commercetools-uikit/primary-button';
import {
  Drawer,
  useModalState,
} from '@commercetools-frontend/application-components';
import DrawerContent from '../organisms/new-bundle/drawer-content';
import { FilePlus2 } from 'lucide-react';
import { Form, Formik } from 'formik';
import { useCloseModalConfirmation } from '../../hooks/use-close-modal-confirmation';

export type BundleFormikValues = {
  createProduct: boolean;
  selectProduct: boolean;
  bundleType?: {
    label: string;
    value: string;
  };
  mainProductCreation?: {
    name?: Record<string, string>;
    description?: Record<string, string>;
    key?: string;
    masterVariant?: {
      sku: string;
    };
  };
  bundleConfiguration?: any;
  mainProductReference?: {
    id?: string;
  };
};

const AddNewBundleButton = () => {
  const { isModalOpen, openModal, closeModal } = useModalState();
  const { ConfirmationModal, showConfirmationModal } =
    useCloseModalConfirmation();

  return (
    <Formik<BundleFormikValues>
      initialValues={{
        createProduct: false,
        selectProduct: true,
        mainProductCreation: {},
        mainProductReference: {},
      }}
      onSubmit={() => {}}
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
      }) => (
        <>
          <PrimaryButton
            onClick={openModal}
            label="Add new bundle"
            data-testid="add-bundle-button"
            iconLeft={<FilePlus2 stroke="white" height={16} width={16} />}
          />
          <Form>
            <Drawer
              isOpen={isModalOpen}
              onClose={() => showConfirmationModal(dirty, closeModal)}
              title="Add new bundle"
              size={30}
              isPrimaryButtonDisabled={isSubmitting || !dirty || !isValid}
              isSecondaryButtonDisabled={isSubmitting}
              onPrimaryButtonClick={submitForm}
              onSecondaryButtonClick={() =>
                showConfirmationModal(dirty, closeModal)
              }
            >
              <DrawerContent
                handleChange={handleChange}
                handleBlur={handleBlur}
                touched={touched}
                values={values}
                errors={errors}
              />
            </Drawer>
          </Form>
          <ConfirmationModal
            onCloseConfirmation={() => {
              resetForm();
              closeModal();
            }}
          />
        </>
      )}
    </Formik>
  );
};

export default AddNewBundleButton;
