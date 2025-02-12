import React from 'react';
import AddNewBundleButton from '../molecules/add-new-bundle-button';
import Spacings from '@commercetools-uikit/spacings';
import Constraints from '@commercetools-uikit/constraints';
import BundlesTable from '../organisms/bundles-table';
import { useFeatureFlags } from '../../hooks/use-feature-flags';
import Text from '@commercetools-uikit/text';
const BundleListPage = ({ parentUrl }: { parentUrl: string }) => {
  const { customObjectBundle, productAttributeBundle } = useFeatureFlags();
  return (
    <Constraints.Horizontal max="scale">
      <Spacings.Stack scale="m">
        <Spacings.Inline alignItems="center" justifyContent="flex-end">
          <AddNewBundleButton />
        </Spacings.Inline>
        <Constraints.Horizontal max="scale">
          {customObjectBundle ? (
            <BundlesTable parentUrl={parentUrl} />
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
