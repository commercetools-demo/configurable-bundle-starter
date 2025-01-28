import React, { useEffect, useState } from 'react';
import { useSchema } from '../../../../hooks/use-schema';
import { SchemaResponse } from '../../../../hooks/use-schema/types';
import { BundleFormikValues } from '../../../molecules/add-new-bundle-button';
import CustomObjectDetails from '../../bundle-configuratiom-details';
import { useFormik } from 'formik';

type Formik = ReturnType<typeof useFormik>;

interface Props {
  values: BundleFormikValues;
  touched: Formik['touched'];
  errors: Formik['errors'];
  handleChange: Formik['handleChange'];
  handleBlur: Formik['handleBlur'];
}
const BundleConfigurationStep = ({
  handleChange,
  handleBlur,
  touched,
  values,
  errors,
}: Props) => {
  const [schema, setSchema] = useState<SchemaResponse>();
  const { getSchema } = useSchema();

  useEffect(() => {
    values.bundleType?.value &&
      getSchema(values.bundleType?.value).then((schema) => {
        setSchema(schema);
      });
  }, [values.bundleType]);
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
