import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { useFormik } from 'formik';

import messages from './messages';
import { SchemaResponse } from '../../../hooks/use-schema/types';
import Spacings from '@commercetools-uikit/spacings';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import Card from '@commercetools-uikit/card';
import AttributeField from './attribute-field';
import get from 'lodash/get';

type Formik = ReturnType<typeof useFormik>;

type Props<T> = {
  schema: SchemaResponse;
  values: T;
  name: string;
  handleChange: Formik['handleChange'];
  touched: Formik['touched'];
  errors: Formik['errors'];
  handleBlur: Formik['handleBlur'];
};

function CustomObjectForm<T>({
  values,
  schema,
  touched,
  errors,
  name: parentName,
  handleChange,
  handleBlur,
}: Props<T>) {
  return (
    <Spacings.Stack scale="m">
      {schema.value?.attributes && (
        <CollapsiblePanel
          header={
            <CollapsiblePanel.Header>
              <FormattedMessage {...messages.customObjectInformationTitle} />
            </CollapsiblePanel.Header>
          }
        >
          {schema.value?.attributes.map((attribute, index) => {
            const name = `${parentName}.${attribute.name}`;
            return (
              <Card key={index} type="flat" insetScale="s">
                <AttributeField
                  key={index}
                  type={attribute.type}
                  attributes={attribute.attributes}
                  reference={attribute.reference}
                  options={attribute.enum || attribute.lenum}
                  name={name}
                  title={attribute.name}
                  isRequired={attribute.required}
                  isSet={attribute.set}
                  value={get(values, name)}
                  touched={get(touched, name)}
                  errors={get(errors, name)}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Card>
            );
          })}
        </CollapsiblePanel>
      )}
    </Spacings.Stack>
  );
}
CustomObjectForm.displayName = 'CustomObjectForm';

export default CustomObjectForm;
