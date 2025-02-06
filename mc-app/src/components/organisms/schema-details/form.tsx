import React, { FC } from 'react';
import get from 'lodash/get';
import { FormattedMessage, useIntl } from 'react-intl';
import { FieldArray, useFormik } from 'formik';
import Card from '@commercetools-uikit/card';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import Constraints from '@commercetools-uikit/constraints';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import FieldLabel from '@commercetools-uikit/field-label';
import TextField from '@commercetools-uikit/text-field';
import { BinLinearIcon, PlusBoldIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import styles from './form.module.css';
import SecondaryIconButton from '@commercetools-uikit/secondary-icon-button';
import { emptyAttribute, emptyProductType } from '../../../utils/contants';
import AttributeGroup from '../schema-attribute/attribute-group';
import messages from './messages';
import { SchemaFormValues } from '.';
import ReferenceInput from '../reference-input';

type Formik = ReturnType<typeof useFormik<SchemaFormValues>>;

type Props = {
  values: SchemaFormValues;
  touched: Formik['touched'];
  errors: Formik['errors'];
  handleBlur: Formik['handleBlur'];
  handleChange: Formik['handleChange'];
};

const Form: FC<Props> = ({
  values,
  touched,
  errors,
  handleBlur,
  handleChange,
}) => {
  const intl = useIntl();
  return (
    <Spacings.Stack scale="m">
      <CollapsiblePanel
        header={
          <CollapsiblePanel.Header>
            <FormattedMessage {...messages.generalInformationTitle} />
          </CollapsiblePanel.Header>
        }
        className={styles.panel}
      >
        <div className={styles.form}>
          <Card type="flat" className={styles['field-card']}>
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
          </Card>
          <Card type="flat" className={styles['field-card']}>
            <FieldArray
              validateOnChange={false}
              name="targetProductTypes"
              render={({ push, remove }) => (
                <Spacings.Stack>
                  <FieldLabel
                    title={
                      <FormattedMessage {...messages.targetProductTypesTitle} />
                    }
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
                          title={
                            <FormattedMessage {...messages.productTypeTitle} />
                          }
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
                          title={
                            <FormattedMessage {...messages.attributeTitle} />
                          }
                          isRequired
                          errors={
                            TextField.toFieldErrors<SchemaFormValues>(errors)
                              .name
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </Card>
                      <SecondaryIconButton
                        icon={<BinLinearIcon />}
                        label={intl.formatMessage(
                          messages.removeAttributeButton
                        )}
                        onClick={() => remove(index)}
                      />
                    </Spacings.Inline>
                  ))}
                </Spacings.Stack>
              )}
            />
          </Card>
        </div>
      </CollapsiblePanel>
      <CollapsiblePanel
        header={
          <CollapsiblePanel.Header>
            <FormattedMessage {...messages.containerInformationTitle} />
          </CollapsiblePanel.Header>
        }
        className={styles.panel}
      >
        <div className={styles.form}>
          <Card type="flat">
            <FieldArray
              validateOnChange={false}
              name="attributes"
              render={({ push, remove }) => (
                <Spacings.Stack>
                  <FieldLabel
                    title={<FormattedMessage {...messages.attributesTitle} />}
                    hasRequiredIndicator
                  />
                  <Constraints.Horizontal max="scale">
                    <SecondaryButton
                      label={intl.formatMessage(messages.addAttributeButton)}
                      iconLeft={<PlusBoldIcon />}
                      onClick={() => push(emptyAttribute)}
                    />
                  </Constraints.Horizontal>
                  {values.attributes?.map((val, index) => {
                    return (
                      <Card type="flat" theme="dark" key={index}>
                        <AttributeGroup
                          name={`attributes.${index}`}
                          value={values.attributes?.[index]!}
                          touched={get(touched, `attributes[${index}]`, {})}
                          errors={get(errors, `attributes[${index}]`, {})}
                          handleBlur={handleBlur}
                          handleChange={handleChange}
                          remove={() => remove(index)}
                          removeDisabled={
                            index === 0 && values.attributes?.length === 1
                          }
                        />
                      </Card>
                    );
                  })}
                </Spacings.Stack>
              )}
            />
          </Card>
        </div>
      </CollapsiblePanel>
    </Spacings.Stack>
  );
};
Form.displayName = 'Form';

export default Form;
