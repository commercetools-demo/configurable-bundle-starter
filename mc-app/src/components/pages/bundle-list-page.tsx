import React from 'react';
import AddNewBundleButton from '../molecules/add-new-bundle-button';
import Spacings from '@commercetools-uikit/spacings';

const BundleListPage = () => {
  return (
    <Spacings.Stack>
      <Spacings.Inline alignItems="center" justifyContent="flex-end">
        <AddNewBundleButton />
      </Spacings.Inline>
    </Spacings.Stack>
  );
};

export default BundleListPage;
