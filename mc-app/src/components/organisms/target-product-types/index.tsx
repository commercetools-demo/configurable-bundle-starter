import { FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { FieldArray, Formik, useFormik } from 'formik';
import { SchemaFormValues } from '../schema-details';
import SecondaryIconButton from '@commercetools-uikit/secondary-icon-button';
import Card from '@commercetools-uikit/card';
import Constraints from '@commercetools-uikit/constraints';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import FieldLabel from '@commercetools-uikit/field-label';
import TextField from '@commercetools-uikit/text-field';
import { emptyProductType } from '../../../utils/contants';
import Spacings from '@commercetools-uikit/spacings';
import styles from '../schema-details/form.module.css';
import { BinLinearIcon, PlusBoldIcon } from '@commercetools-uikit/icons';
import messages from '../schema-details/messages';
import ReferenceInput from '../reference-input';
type Formik = ReturnType<typeof useFormik<SchemaFormValues>>;

type Props = {
  values: SchemaFormValues;
  touched: Formik['touched'];
  errors: Formik['errors'];
  handleBlur: Formik['handleBlur'];
  handleChange: Formik['handleChange'];
};

const TargetProductTypes: FC<Props> = ({
  values,
  touched,
  errors,
  handleBlur,
  handleChange,
}) => {
  const intl = useIntl();

  return (
    <Card type="flat" className={styles['field-card']}>
      <FieldArray
        validateOnChange={false}
        name="targetProductTypes"
        render={({ push, remove }) => (
          <Spacings.Stack>
            <FieldLabel
              title={<FormattedMessage {...messages.targetProductTypesTitle} />}
              hasRequiredIndicator
            />
            <Constraints.Horizontal max="scale">
              <SecondaryButton
                label={intl.formatMessage(messages.addProductTypeButton)}
                iconLeft={<PlusBoldIcon />}
                onClick={() => push(emptyProductType)}
              />
            </Constraints.Horizontal>
            {values.targetProductTypes?.map((val, index) => (
              <Spacings.Inline
                key={val.productType?.id || index}
                alignItems="center"
              >
                <Card type="flat">
                  <FieldLabel
                    title={<FormattedMessage {...messages.productTypeTitle} />}
                    hasRequiredIndicator
                  />
                  <ReferenceInput
                    name={`targetProductTypes.${index}.productType`}
                    value={val.productType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    reference={{
                      by: 'id',
                      type: 'product-type',
                    }}
                  />
                  <TextField
                    name={`targetProductTypes.${index}.attribute`}
                    value={val.attribute}
                    title={<FormattedMessage {...messages.attributeTitle} />}
                    isRequired
                    errors={
                      TextField.toFieldErrors<SchemaFormValues>(errors).name
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </Card>
                <SecondaryIconButton
                  icon={<BinLinearIcon />}
                  label={intl.formatMessage(messages.removeAttributeButton)}
                  onClick={() => remove(index)}
                />
              </Spacings.Inline>
            ))}
          </Spacings.Stack>
        )}
      />
    </Card>
  );
};

TargetProductTypes.displayName = 'TargetProductTypes';

export default TargetProductTypes;
