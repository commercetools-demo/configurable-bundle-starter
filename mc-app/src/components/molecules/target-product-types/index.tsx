import Card from '@commercetools-uikit/card';
import Constraints from '@commercetools-uikit/constraints';
import FieldLabel from '@commercetools-uikit/field-label';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import { FieldArray, Formik, useFormik } from 'formik';
import { FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { emptyProductType } from '../../../utils/contants';
import { SchemaFormValues } from '../../organisms/schema-details';
import styles from '../../organisms/schema-details/form.module.css';
import messages from '../../organisms/schema-details/messages';
import TargetItem from './target-item';

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
              <TargetItem
                errors={errors}
                onRemove={() => remove(index)}
                key={index}
                index={index}
                value={val}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            ))}
          </Spacings.Stack>
        )}
      />
    </Card>
  );
};

TargetProductTypes.displayName = 'TargetProductTypes';

export default TargetProductTypes;
