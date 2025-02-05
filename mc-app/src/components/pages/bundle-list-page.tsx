import React from 'react';
import AddNewBundleButton from '../molecules/add-new-bundle-button';
import Spacings from '@commercetools-uikit/spacings';
import Constraints from '@commercetools-uikit/constraints';
import BundlesTable from '../organisms/bundles-table';

const BundleListPage = () => {
  return (
    <Constraints.Horizontal max="scale">
      <Spacings.Stack scale="m">
        <Spacings.Inline alignItems="center" justifyContent="flex-end">
          <AddNewBundleButton />
        </Spacings.Inline>
        <Constraints.Horizontal max="scale">
          <BundlesTable />
        </Constraints.Horizontal>
      </Spacings.Stack>
    </Constraints.Horizontal>
  );
};

export default BundleListPage;
