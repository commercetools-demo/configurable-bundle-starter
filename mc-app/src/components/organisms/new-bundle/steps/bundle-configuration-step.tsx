import React from 'react';
import { SchemaResponse } from '../../../../hooks/use-schema/types';
import { BundleFormikValues } from '../../../molecules/add-new-bundle-button';
import CustomObjectDetails from '../../bundle-configuratiom-details';
import { useFormik } from 'formik';

type Formik = ReturnType<typeof useFormik>;

interface Props {
  values: BundleFormikValues;
  touched: Formik['touched'];
  errors: Formik['errors'];
  schema?: SchemaResponse;
  handleChange: Formik['handleChange'];
  handleBlur: Formik['handleBlur'];
}
const BundleConfigurationStep = ({
  handleChange,
  handleBlur,
  schema,
  touched,
  values,
  errors,
}: Props) => {
  if (!schema) {
    return null;
  }
  return (
    <div>
      <CustomObjectDetails
        schema={schema}
        values={values}
        errors={errors}
        handleChange={handleChange}
        handleBlur={handleBlur}
        touched={touched}
      />
    </div>
  );
};

export default BundleConfigurationStep;
