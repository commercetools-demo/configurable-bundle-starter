import PrimaryButton from '@commercetools-uikit/primary-button';
import {
  FormModalPage,
  useModalState,
} from '@commercetools-frontend/application-components';
import DrawerContent from '../organisms/new-bundle/drawer-content';
import { FilePlus2 } from 'lucide-react';
import { Form, Formik } from 'formik';
import { useCloseModalConfirmation } from '../../hooks/use-close-modal-confirmation';
import { useConfigurableBundles } from '../../hooks/use-configurable-bundles';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { CONFIGURATION_TYPES_ENUM } from '../../utils/contants';

export type BundleFormikValues = {
  createProduct: boolean;
  selectProduct: boolean;
  configurationType?: CONFIGURATION_TYPES_ENUM;
  bundleType?: {
    label: string;
    value: string;
  };
  mainProductCreation?: {
    id?: string;
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
  const showNotification = useShowNotification();
  const { createBundle } = useConfigurableBundles();

  const handleSubmit = async (values: BundleFormikValues) => {
    await createBundle(values)
      .then(() => {
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.success,
          domain: DOMAINS.SIDE,
          text: 'Bundle created successfully',
        });
        closeModal();
      })
      .catch((err) => {
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.error,
          domain: DOMAINS.SIDE,
          text: err.message || 'Failed to create bundle',
        });
      });
  };

  return (
    <Formik<BundleFormikValues>
      initialValues={{
        createProduct: false,
        selectProduct: true,
        mainProductCreation: {},
        mainProductReference: {},
      }}
      onSubmit={handleSubmit}
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
            <FormModalPage
              isOpen={isModalOpen}
              title="Add new bundle"
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
            </FormModalPage>
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
