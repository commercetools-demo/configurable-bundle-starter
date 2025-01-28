import React, { useCallback, useEffect, useState } from 'react';
import Text from '@commercetools-uikit/text';
import Spacings from '@commercetools-uikit/spacings';
import AsyncSelectField from '@commercetools-uikit/async-select-field';
import { BundleFormikValues } from '../../../molecules/add-new-bundle-button';
import { useSchema } from '../../../../hooks/use-schema';
interface Props {
  handleChange: (e: any) => void;
  values: BundleFormikValues;
  errors: any;
}
const SelectBundleTypeStep = ({ handleChange, values, errors }: Props) => {
  const [defaultOptions, setDefaultOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const { getSchemas } = useSchema();

  const loadOptions = () =>
    getSchemas().then((schemas) => {
      return schemas.map((schema) => ({
        label: schema.value?.name,
        value: schema.key,
      }));
    });

  useEffect(() => {
    loadOptions().then((options) => {
      setDefaultOptions(options as { label: string; value: string }[]);
    });
  }, []);

  return (
    <Spacings.Stack scale="m">
      <Text.Headline as="h2">Select Bundle Type</Text.Headline>
      <Spacings.Inline scale="m">
        <AsyncSelectField
          title="Bundle Type"
          name="bundleType"
          value={values.bundleType}
          onChange={handleChange}
          errors={errors.bundleType}
          touched={!!errors.bundleType}
          defaultOptions={defaultOptions}
          loadOptions={loadOptions}
        />
      </Spacings.Inline>
    </Spacings.Stack>
  );
};

export default SelectBundleTypeStep;
