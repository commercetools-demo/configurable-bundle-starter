import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useProductTypeConnector } from '../../../hooks/use-product-type-connector';
import {
  AttributeValue,
  SchemaResponse,
} from '../../../hooks/use-schema/types';
import {
  mapAttributeDefinitionsToAttributes,
} from '../../../utils/attributes';
import CustomObjectDetails from '../../organisms/bundle-configuratiom-details';
import { ProductFormikValues } from '../../organisms/new-product/add-new-product-button';
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
  const [attributes, setAttributes] = useState<AttributeValue[]>([]);
  const { getAttributes, getProductTypeAttributeDefinitions } =
    useProductTypeConnector();

  useEffect(() => {
    getAttributes(values.productDraft?.productType?.id, true).then(
      (attributes) =>
        mapAttributeDefinitionsToAttributes(
          attributes,
          getProductTypeAttributeDefinitions
        ).then((mappedAttributes) => {
          setAttributes(mappedAttributes);
        })
    );
  }, [values.productDraft?.productType?.id]);
  if (!values.productDraft?.productType?.id) {
    return null;
  }
  return (
    <div>
      <CustomObjectDetails<ProductFormikValues>
        name="productDraft.masterVariant.attributes"
        schema={
          {
            value: {
              attributes,
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

export default ProductAttributeForm;
