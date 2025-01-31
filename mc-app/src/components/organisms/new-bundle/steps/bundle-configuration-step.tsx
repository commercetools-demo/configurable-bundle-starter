import React from 'react';
import { SchemaResponse } from '../../../../hooks/use-schema/types';
import { BundleFormikValues } from '../../../molecules/add-new-bundle-button';
import CustomObjectDetails from '../../bundle-configuratiom-details';
import { useFormik } from 'formik';
import { CONFIGURATION_TYPES_ENUM } from '../../../../utils/contants';
import ProductAttributeDetails from '../../product-attribute-details';

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
  if (
    !schema &&
    values.configurationType === CONFIGURATION_TYPES_ENUM.CUSTOM_OBJECT
  ) {
    return null;
  }
  if (schema) {
    return (
      <div>
        <CustomObjectDetails<BundleFormikValues>
          name="bundleConfiguration"
          schema={schema}
          values={values}
          errors={errors}
          handleChange={handleChange}
          handleBlur={handleBlur}
          touched={touched}
        />
      </div>
    );
  }
  return (
    <ProductAttributeDetails
      values={values}
      errors={errors}
      handleChange={handleChange}
      handleBlur={handleBlur}
      touched={touched}
    />
  );
};

export default BundleConfigurationStep;
