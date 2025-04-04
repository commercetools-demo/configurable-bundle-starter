import React, { FC } from 'react';
import get from 'lodash/get';
import { FormattedMessage, useIntl } from 'react-intl';
import { FieldArray, useFormik } from 'formik';
import Card from '@commercetools-uikit/card';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import Constraints from '@commercetools-uikit/constraints';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import FieldLabel from '@commercetools-uikit/field-label';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import styles from './form.module.css';
import { emptyAttribute } from '../../../utils/contants';
import AttributeGroup from '../schema-attribute/attribute-group';
import messages from './messages';
import { SchemaFormValues } from '.';
import TargetProductTypes from '../../molecules/target-product-types';
import BundleUIAttributes from '../../molecules/bundle-ui-attributes';
import { SchemaConfiguration } from '../schema-configuration';

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
            <SchemaConfiguration
              values={values}
              touched={touched}
              errors={errors}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
          </Card>
          <TargetProductTypes
            values={values}
            touched={touched}
            errors={errors}
            handleBlur={handleBlur}
            handleChange={handleChange}
          />
          <Constraints.Horizontal max="scale">
            <BundleUIAttributes
              values={values}
              touched={touched}
              errors={errors}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
          </Constraints.Horizontal>
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
