import Spacings from '@commercetools-uikit/spacings';
import React from 'react';
import ReferenceInput from '../reference-input';
import { FormikValues } from '../../molecules/add-new-bundle-button';

interface Props {
  handleChange: (e: any) => void;
  values: FormikValues;
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
