import React, { useEffect, useState } from 'react';
import AddNewBundleButton from '../molecules/add-new-bundle-button';
import Spacings from '@commercetools-uikit/spacings';
import Constraints from '@commercetools-uikit/constraints';
import BundlesTable from '../organisms/bundles-table';
import { useFeatureFlags } from '../../hooks/use-feature-flags';
import Text from '@commercetools-uikit/text';
import { useConfigurableBundles } from '../../hooks/use-configurable-bundles';
import { BundleResponse } from '../../hooks/use-configurable-bundles/types';
import { ContentNotification } from '@commercetools-uikit/notifications';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
const BundleListPage = ({ parentUrl }: { parentUrl: string }) => {
  const { customObjectBundle, productAttributeBundle } = useFeatureFlags();
  const { getBundles } = useConfigurableBundles();


  const [bundles, setBundles] = useState<BundleResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBundles().then((bundles) => {
      setBundles(bundles);
      setLoading(false);
    });
  }, []);

  return (
    <Constraints.Horizontal max="scale">
      <Spacings.Stack scale="m">
        <Spacings.Inline alignItems="center" justifyContent="space-between">
          <Spacings.Inline scale="m" alignItems="center">
            <Text.Headline as="h2">Bundles</Text.Headline>
            <Text.Caption>
              {bundles.length} results
            </Text.Caption>
          </Spacings.Inline>
          <Spacings.Inline scale="m">
            <AddNewBundleButton />
          </Spacings.Inline>
        </Spacings.Inline>
        <Constraints.Horizontal max="scale">
          {customObjectBundle ? (
            <>
              {loading ? (
                <Spacings.Inline scale="m" alignItems="center" justifyContent="center">
                  <LoadingSpinner />
                </Spacings.Inline>
              ) : (
                <BundlesTable parentUrl={parentUrl} bundles={bundles} />
              )}
            </>
          ) : (
            <Text.Headline as="h2">
              Start creating a bundle by clicking the button above.
            </Text.Headline>
          )}
        </Constraints.Horizontal>
      </Spacings.Stack>
    </Constraints.Horizontal>
  );
};

export default BundleListPage;
