import Card from '@commercetools-uikit/card';
import Constraints from '@commercetools-uikit/constraints';
import FieldLabel from '@commercetools-uikit/field-label';
import { BinLinearIcon, PlusBoldIcon } from '@commercetools-uikit/icons';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import SecondaryIconButton from '@commercetools-uikit/secondary-icon-button';
import Spacings from '@commercetools-uikit/spacings';
import TextField from '@commercetools-uikit/text-field';
import { FieldArray, Formik, useFormik } from 'formik';
import { FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { emptyProductType } from '../../../utils/contants';
import ReferenceInput from '../../organisms/reference-input';
import { SchemaFormValues } from '../../organisms/schema-details';
import messages from '../../organisms/schema-details/messages';
import styles from '../../organisms/schema-details/form.module.css';
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
