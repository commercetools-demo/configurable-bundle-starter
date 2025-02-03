import React, { FC } from 'react';
import { reduce, isPlainObject, get, set } from 'lodash';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { getAttributeValues } from '../../../utils/form-utils';
import {
  AttributeValue,
  SchemaResponse,
} from '../../../hooks/use-schema/types';
import { BundleFormikValues } from '../../molecules/add-new-bundle-button';
import CustomObjectForm from '../bundle-configuration-form';
import { useFormik } from 'formik';

type Formik = ReturnType<typeof useFormik>;

type Props<T> = {
  values: T;
  schema: SchemaResponse;
  touched: Formik['touched'];
  errors: Formik['errors'];
  handleChange: Formik['handleChange'];
  handleBlur: Formik['handleBlur'];
  name: string;
};

const getValueForAttributes = (value: any, empty: any): any => {
  return reduce(
    empty,
    (result, val, key) => ({
      ...result,
      [key]: isPlainObject(val)
        ? getValueForAttributes(get(value, key), val)
        : get(value, key) || val,
    }),
    value ? value : {}
  );
};

const initializeCustomObjectValues = (
  customObject: any,
  schema: SchemaResponse,
  currencies: Array<string>,
  languages: Array<string>
): BundleFormikValues => {
  const attributes: Array<AttributeValue> =
    (schema?.value?.attributes as Array<AttributeValue>) || [];
  // combining empty attribute values with saved values in case schema changed
  return getValueForAttributes(
    customObject,
    getAttributeValues(attributes, currencies, languages)
  );
};

function CustomObjectDetails<T extends Record<string, any>>({
  name,
  schema,
  values,
  handleChange,
  handleBlur,
  errors,
  touched,
}: Props<T>) {
  const { currencies, languages } = useApplicationContext((context) => ({
    languages: context.project?.languages ?? [],
    currencies: context.project?.currencies ?? [],
  }));

  const initial = initializeCustomObjectValues(
    get(values, name),
    schema,
    currencies,
    languages
  );

  return (
    <CustomObjectForm
      values={{
        ...values,
        ...set(values, name, initial),
      }}
      name={name}
      errors={errors}
      touched={touched}
      handleBlur={handleBlur}
      handleChange={handleChange}
      schema={schema}
    ></CustomObjectForm>
  );
}
CustomObjectDetails.displayName = 'CustomObjectDetails';

export default CustomObjectDetails;
