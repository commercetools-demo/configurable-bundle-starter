import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { ProductFormikValues } from '../../organisms/new-product/add-new-product-button';
import { useProductTypeConnector } from '../../../hooks/use-product-type-connector';
import { AttributeDefinition } from '@commercetools/platform-sdk';
import CustomObjectDetails from '../../organisms/bundle-configuratiom-details';
import { convertAttributeDefinitionToAttribute } from '../../../utils/attributes';
type Formik = ReturnType<typeof useFormik>;

interface Props {
  handleChange: Formik['handleChange'];
  values: ProductFormikValues;
  errors: Formik['errors'];
  handleBlur: Formik['handleBlur'];
  touched: Formik['touched'];
}
const ProductAttributeForm = ({
  values,
  errors,
  handleChange,
  handleBlur,
  touched,
}: Props) => {
  const [attributes, setAttributes] = useState<AttributeDefinition[]>([]);
  const { getAttributes } = useProductTypeConnector();

  useEffect(() => {
    getAttributes(values.productDraft?.productType?.id, true).then(
      (attributes) => {
        setAttributes(
          attributes.map((item) => convertAttributeDefinitionToAttribute(item))
        );
      }
    );
  }, [values.productDraft?.productType?.id]);
  if (!values.productDraft?.productType?.id) {
    return null;
  }
  return (
    <div>
      <CustomObjectDetails<ProductFormikValues>
        name="productDraft.masterVariant.attributes"
        schema={{
          value: {
            // @ts-ignore
            attributes,
          },
        }}
        values={values}
        errors={errors}
        handleChange={handleChange}
        handleBlur={handleBlur}
        touched={touched}
      />
    </div>
  );
};

export default ProductAttributeForm;
