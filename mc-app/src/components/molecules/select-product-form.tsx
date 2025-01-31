import Spacings from '@commercetools-uikit/spacings';
import React, { useMemo } from 'react';
import ReferenceInput from '../organisms/reference-input';
import { BundleFormikValues } from './add-new-bundle-button';
import { SchemaResponse } from '../../hooks/use-schema/types';

interface Props {
  handleChange: (e: any) => void;
  values: BundleFormikValues;
  errors: any;
  schema?: SchemaResponse;
}
const SelectProductForm = ({ handleChange, values, errors, schema }: Props) => {
  const where = useMemo(() => {
    if (!schema) {
      return undefined;
    }
    return {
      string: `productType.id: ${schema.value?.targetProductTypes
        .map((item) => `"${item.productType.id}"`)
        .join(',')}`,
    };
  }, [schema]);

  return (
    <Spacings.Stack>
      <ReferenceInput
        onBlur={() => {}}
        name="mainProductReference"
        reference={{
          by: 'id',
          type: 'product',
        }}
        where={where}
        onChange={handleChange}
        value={values.mainProductReference}
      />
    </Spacings.Stack>
  );
};

export default SelectProductForm;
