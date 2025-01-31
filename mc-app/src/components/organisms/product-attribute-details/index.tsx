import React, { useEffect, useMemo, useState } from 'react';
import { BundleFormikValues } from '../../molecules/add-new-bundle-button';
import { useFormik } from 'formik';
import { AttributeDefinition } from '@commercetools/platform-sdk';
import { useProductTypeConnector } from '../../../hooks/use-product-type-connector';
import { convertAttributeDefinitionToAttribute, mapAttributeDefinitionsToAttributes } from '../../../utils/attributes';
import { useProductUpdater } from '../../../hooks/use-product-connector';
import CustomObjectDetails from '../bundle-configuratiom-details';
import { AttributeValue, SchemaResponse } from '../../../hooks/use-schema/types';
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
  const [attributes, setAttributes] = useState<AttributeValue[]>([]);
  const { getAttributes, getProductTypeAttributeDefinitions } = useProductTypeConnector();
  const { getProduct } = useProductUpdater();

  useEffect(() => {
    if (values.mainProductReference?.id) {
      getProduct(values.mainProductReference?.id).then((product) => {
        getAttributes(product.productType?.id).then((attributes) => {
          mapAttributeDefinitionsToAttributes(attributes, getProductTypeAttributeDefinitions).then((attributes) => {
            setAttributes(attributes);
          })
        });
      });
    }
  }, [values.mainProductReference?.id]);
  if (!values.mainProductReference?.id) {
    return null;
  }
  return (
    <div>
      <CustomObjectDetails<BundleFormikValues>
        name="productDraft.masterVariant.attributes"
        schema={{
          value: {
            attributes,
          },
        } as SchemaResponse}
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
