import React, { useEffect, useMemo, useState } from 'react';
import { BundleFormikValues } from '../../../molecules/add-new-bundle-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { SchemaResponse } from '../../../../hooks/use-schema/types';

import BundleConfigurationInfo from '../../../molecules/bundle-config-info/bundle-configuration-info';
import { CONFIGURATION_TYPES_ENUM } from '../../../../utils/contants';
import { useProductAttributes } from '../../../../hooks/use-product-attributes';

interface Props {
  values: BundleFormikValues;
  schema?: SchemaResponse;
}
const ReviewStep = ({ values, schema }: Props) => {
  const [reviewSchema, setReviewSchema] = useState(schema);
  const { getProductAttributeSchemaByProductId } = useProductAttributes();

  const referenceValues = useMemo(() => {
    if (values.configurationType === CONFIGURATION_TYPES_ENUM.PRODUCT) {
      return {
        bundleConfiguration:
          values.mainProductReference?.masterVariant?.attributes,
      } as BundleFormikValues;
    }
    return values;
  }, [values.configurationType]);

  useEffect(() => {
    if (values.configurationType === CONFIGURATION_TYPES_ENUM.PRODUCT) {
      getProductAttributeSchemaByProductId(
        values.mainProductReference?.id
      ).then((attributes) => {
        setReviewSchema({
          value: {
            attributes,
          },
        } as SchemaResponse);
      });
    }
  }, [values.configurationType, values.mainProductReference?.id]);
  return (
    <Spacings.Stack scale="m">
      <Text.Headline as="h2">Review Step</Text.Headline>
      <BundleConfigurationInfo schema={reviewSchema} values={referenceValues} />
    </Spacings.Stack>
  );
};

export default ReviewStep;
