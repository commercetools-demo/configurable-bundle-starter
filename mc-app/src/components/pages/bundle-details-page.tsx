import React from 'react';
import { useHistory, useParams } from 'react-router';
import { useConfigurableBundles } from '../../hooks/use-configurable-bundles';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Text from '@commercetools-uikit/text';
import { BundleResponse } from '../../hooks/use-configurable-bundles/types';
import BundleForm from '../organisms/bundle-form';
import { BundleFormikValues } from '../molecules/add-new-bundle-button';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import { useShowNotification } from '@commercetools-frontend/actions-global';

const BundleDetailsPage = () => {
  const { key } = useParams<{ key: string }>();
  const { getBundle, updateBundle } = useConfigurableBundles();
  const history = useHistory();
  const [bundle, setBundle] = React.useState<BundleResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const showNotification = useShowNotification();

  const handleSubmit = async (values: BundleFormikValues) => {
    await updateBundle(key, values)
      .then(() => {
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.success,
          domain: DOMAINS.SIDE,
          text: 'Bundle created successfully',
        });
        history.replace(`/`);
      })
      .catch((err) => {
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.error,
          domain: DOMAINS.SIDE,
          text: err.message || 'Failed to create bundle',
        });
      });
  };

  React.useEffect(() => {
    getBundle(key).then((bundleData) => {
      setBundle(bundleData);
      setLoading(false);
    });
  }, [key]);

  if (loading) {
    return (
      <ContentNotification type="info">
        <Text.Body>Loading bundle details...</Text.Body>
      </ContentNotification>
    );
  }

  if (!bundle) {
    return (
      <ContentNotification type="error">
        <Text.Body>Bundle not found</Text.Body>
      </ContentNotification>
    );
  }

  return (
    <BundleForm
      initialValues={{
        ...bundle.value,
        createProduct: false,
        selectProduct: true,
      }}
      isModalOpen={true}
      closeModal={() => history.goBack()}
      onSubmit={handleSubmit}
    ></BundleForm>
  );
};

export default BundleDetailsPage;
