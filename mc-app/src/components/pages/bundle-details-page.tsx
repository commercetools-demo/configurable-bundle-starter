import React from 'react';
import { useHistory, useParams } from 'react-router';
import { useConfigurableBundles } from '../../hooks/use-configurable-bundles';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Text from '@commercetools-uikit/text';
import Spacings from '@commercetools-uikit/spacings';
import Constraints from '@commercetools-uikit/constraints';
import { BundleResponse } from '../../hooks/use-configurable-bundles/types';
import BundleForm from '../organisms/bundle-form';
import { BundleFormikValues } from '../molecules/add-new-bundle-button';

const BundleDetailsPage = () => {
  const { key } = useParams<{ key: string }>();
  const { getBundle } = useConfigurableBundles();
  const history = useHistory();
  const [bundle, setBundle] = React.useState<BundleResponse | null>(null);
  const [loading, setLoading] = React.useState(true);

  const handleSubmit = async (values: BundleFormikValues) => {
    console.log(values);
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
