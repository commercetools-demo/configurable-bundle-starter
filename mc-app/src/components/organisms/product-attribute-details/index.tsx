import React, { useEffect, useState } from 'react';
import { BundleFormikValues } from '../../molecules/add-new-bundle-button';
import { useFormik, useFormikContext } from 'formik';
import CustomObjectDetails from '../bundle-configuratiom-details';
import {
  AttributeValue,
  SchemaResponse,
} from '../../../hooks/use-schema/types';
import { useProductAttributes } from '../../../hooks/use-product-attributes';
type Formik = ReturnType<typeof useFormik>;

interface Props {
  values: BundleFormikValues;
  touched: Formik['touched'];
  errors: Formik['errors'];
  handleChange: Formik['handleChange'];
  handleBlur: Formik['handleBlur'];
}
const ProductAttributeDetails = ({
  values,
  errors,
  handleChange,
  handleBlur,
  touched,
}: Props) => {
  const [emptyAttributes, setEmptyAttributes] = useState<AttributeValue[]>([]);
  const { setValues } = useFormikContext();

  const {
    getAttributeValueMapByProductId,
    getProductAttributeSchemaByProductId,
  } = useProductAttributes();

  useEffect(() => {
    getAttributeValueMapByProductId(values.mainProductReference?.id).then(
      (productAttributeMap) => {
        setValues({
          ...values,
          mainProductReference: {
            ...values.mainProductReference,
            masterVariant: {
              ...values.mainProductReference?.masterVariant,
              attributes: productAttributeMap,
            },
          },
        });
      }
    );

    getProductAttributeSchemaByProductId(values.mainProductReference?.id).then(
      (attributes) => {
        setEmptyAttributes(attributes);
      }
    );
  }, [values.mainProductReference?.id]);
  if (!values.mainProductReference?.id) {
    return null;
  }
  return (
    <div>
      <CustomObjectDetails<BundleFormikValues>
        name="mainProductReference.masterVariant.attributes"
        schema={
          {
            value: {
              attributes: emptyAttributes,
            },
          } as SchemaResponse
        }
        values={values}
        errors={errors}
        handleChange={handleChange}
        handleBlur={handleBlur}
        touched={touched}
      />
    </div>
  );
};

export default ProductAttributeDetails;
