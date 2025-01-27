import React from 'react';
import Text from '@commercetools-uikit/text';
import Spacings from '@commercetools-uikit/spacings';
import SelectField from '@commercetools-uikit/select-field';
import { FormikValues } from '../../molecules/add-new-bundle-button';
interface Props {
  handleChange: (e: any) => void;
  values: FormikValues;
  errors: any;
}
const SelectBundleTypeStep = ({ handleChange, values, errors }: Props) => {
  return (
    <Spacings.Stack scale="m">
      <Text.Headline as="h2">Select Bundle Type</Text.Headline>
      <Spacings.Inline scale="m">
        <SelectField
          title="Bundle Type"
          name="bundleType"
          value={values.bundleType}
          onChange={handleChange}
          errors={errors.bundleType}
          touched={!!errors.bundleType}
          options={[{ value: 'mainbundle', label: 'Fixed Bundle' }]}
        />
      </Spacings.Inline>
    </Spacings.Stack>
  );
};

export default SelectBundleTypeStep;
