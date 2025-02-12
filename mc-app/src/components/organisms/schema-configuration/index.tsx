import TextField from '@commercetools-uikit/text-field';
import SelectField from '@commercetools-uikit/select-field';
import ReferenceInput from '../reference-input';
import { ADD_TO_CART_CONFIGURATION_TYPES } from '../../../utils/contants';
import Spacings from '@commercetools-uikit/spacings';
import { FormattedMessage } from 'react-intl';
import messages from '../schema-details/messages';
import { SchemaFormValues } from '../schema-details';
import { useFormik } from 'formik';
import { FC } from 'react';
import { CustomFieldReferenceInput } from './custom-field-reference-input';
import FieldLabel from '@commercetools-uikit/field-label';
import Constraints from '@commercetools-uikit/constraints';
type Formik = ReturnType<typeof useFormik<SchemaFormValues>>;

type Props = {
  values: SchemaFormValues;
  touched: Formik['touched'];
  errors: Formik['errors'];
  handleBlur: Formik['handleBlur'];
  handleChange: Formik['handleChange'];
};

export const SchemaConfiguration: FC<Props> = ({
  values,
  touched,
  errors,
  handleBlur,
  handleChange,
}) => {
  return (
    <>
      <Spacings.Stack scale="s">
        <TextField
          name="key"
          value={values.key}
          title={<FormattedMessage {...messages.keyTitle} />}
          isRequired
          isReadOnly
          errors={TextField.toFieldErrors<SchemaFormValues>(errors).key}
          touched={touched.key}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        <TextField
          name="name"
          value={values.name || ''}
          title={<FormattedMessage {...messages.nameTitle} />}
          isRequired
          errors={TextField.toFieldErrors<SchemaFormValues>(errors).name}
          touched={touched.name}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        <SelectField
          name="addToCartConfiguration.type"
          value={values.addToCartConfiguration?.type}
          title={
            <FormattedMessage {...messages.addToCartConfigigurationTitle} />
          }
          isRequired
          options={Object.entries(ADD_TO_CART_CONFIGURATION_TYPES).map(
            ([key, value]) => ({
              label: key,
              value,
            })
          )}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {values.addToCartConfiguration?.type && (
          <Spacings.Inline scale="xs">
            <Constraints.Horizontal max={5}>
              <Spacings.Stack scale="xs">
                <FieldLabel
                  title={
                    <FormattedMessage
                      {...messages.customTypeReferenceInputTitle}
                    />
                  }
                />
                <ReferenceInput
                  name="addToCartConfiguration.customType"
                  reference={{
                    by: 'id',
                    type: 'type',
                  }}
                  value={values.addToCartConfiguration?.customType}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                />
              </Spacings.Stack>
            </Constraints.Horizontal>
            <Constraints.Horizontal max={5}>
              <CustomFieldReferenceInput
                name="addToCartConfiguration.customTypeField"
                selectedType={values.addToCartConfiguration?.customType}
                value={values.addToCartConfiguration?.customTypeField}
                handleBlur={handleBlur}
                handleChange={handleChange}
              />
            </Constraints.Horizontal>
          </Spacings.Inline>
        )}
      </Spacings.Stack>
    </>
  );
};
