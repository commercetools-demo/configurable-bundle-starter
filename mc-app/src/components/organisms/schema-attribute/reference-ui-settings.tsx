import React, { FC } from 'react';
import SelectInput from '@commercetools-uikit/select-input';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import {
  ATTRIBUTES,
  PRODUCT_REF_DISPLAY_MODES,
  REFERENCE_TYPES,
  TYPES,
} from '../../../utils/contants';
import messages from '../schema-details/messages';
import styles from './attribute-group.module.css';
import { AttributeValue } from '../../../hooks/use-schema/types';
import { useFormik } from 'formik';
import { TFormValues } from '../../../types';
type Formik = ReturnType<typeof useFormik<TFormValues>>;

type Props = {
  name: string;
  value: AttributeValue;
  touched: any;
  errors: any;
  handleBlur: Formik['handleBlur'];
  handleChange: Formik['handleChange'];
};

const ReferenceUISettings: FC<Props> = ({
  name,
  value,
  touched,
  errors,
  handleBlur,
  handleChange,
}) => {
  if (
    value.set &&
    value.type === TYPES.Reference &&
    value.reference?.type === REFERENCE_TYPES.Product
  ) {
    return (
      <>
        <div className={styles.attributeUISettingsTitle} />
        <Spacings.Stack scale="s">
          <Spacings.Inline alignItems="center">
            <Text.Body isBold intlMessage={messages.attributeUISettingsTitle} />
          </Spacings.Inline>
          <SelectInput
            name={`${name}.${ATTRIBUTES.ProductRefDisplayMode}`}
            value={value.productRefDisplayMode}
            horizontalConstraint={4}
            options={Object.keys(PRODUCT_REF_DISPLAY_MODES).map((key) => ({
              label: key,
              value: PRODUCT_REF_DISPLAY_MODES[key],
            }))}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Select display mode"
            isCondensed
          />
        </Spacings.Stack>
      </>
    );
  }
  return null;
};

ReferenceUISettings.displayName = 'ReferenceUISettings';

export default ReferenceUISettings;
