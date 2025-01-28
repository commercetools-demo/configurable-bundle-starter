import React from 'react';
import { BundleFormikValues } from '../../../molecules/add-new-bundle-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { SchemaResponse } from '../../../../hooks/use-schema/types';

import BundleConfigurationInfo from '../../../molecules/bundle-configuration-info';

interface Props {
  values: BundleFormikValues;
  schema?: SchemaResponse;
}
const ReviewStep = ({ values, schema }: Props) => {
  return (
    <Spacings.Stack scale="m">
      <Text.Headline as="h2">Review Step</Text.Headline>
      <BundleConfigurationInfo schema={schema} values={values} />
    </Spacings.Stack>
  );
};

export default ReviewStep;
