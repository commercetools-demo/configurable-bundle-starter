import Spacings from '@commercetools-uikit/spacings';
import React from 'react';
import ReferenceInput from '../organisms/reference-input';
import { BundleFormikValues } from './add-new-bundle-button';

interface Props {
  handleChange: (e: any) => void;
  values: BundleFormikValues;
  errors: any;
}
const SelectProductForm = ({ handleChange, values, errors }: Props) => {
  return (
    <Spacings.Stack>
      <ReferenceInput
        onBlur={() => {}}
        name="mainProductReference"
        reference={{
          by: 'id',
          type: 'product',
        }}
        onChange={handleChange}
        value={values.mainProductReference}
      />
    </Spacings.Stack>
  );
};

export default SelectProductForm;
