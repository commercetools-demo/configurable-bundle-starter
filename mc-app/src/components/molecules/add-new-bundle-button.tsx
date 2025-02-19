import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  useModalState
} from '@commercetools-frontend/application-components';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { FilePlus2 } from 'lucide-react';
import { useConfigurableBundles } from '../../hooks/use-configurable-bundles';
import { CONFIGURATION_TYPES_ENUM } from '../../utils/contants';
import BundleForm from '../organisms/bundle-form';

export type BundleFormikValues = {
  createProduct: boolean;
  selectProduct: boolean;
  configurationType?: CONFIGURATION_TYPES_ENUM;
  bundleType?: {
    label: string;
    value: string;
  };
  bundleConfiguration?: any;
  mainProductReference?: {
    id?: string;
    masterVariant?: {
      sku?: string;
      attributes?: any;
    };
  };
};

const AddNewBundleButton = () => {
  const { isModalOpen, openModal, closeModal } = useModalState();

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
    <BundleForm
      initialValues={{
        createProduct: false,
        selectProduct: true,
        mainProductReference: {},
      }}
      isModalOpen={isModalOpen}
      closeModal={closeModal}
      onSubmit={handleSubmit}
    >
      <PrimaryButton
        onClick={openModal}
        label="Add new bundle"
        data-testid="add-bundle-button"
        iconLeft={<FilePlus2 stroke="white" height={16} width={16} />}
      />
    </BundleForm>
  );
};

export default AddNewBundleButton;
