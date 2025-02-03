import React, { useEffect, useMemo, useState } from 'react';
import { BundleFormikValues } from '../../molecules/add-new-bundle-button';
import { useFormik, useFormikContext } from 'formik';
import { AttributeDefinition } from '@commercetools/platform-sdk';
import { useProductTypeConnector } from '../../../hooks/use-product-type-connector';
import {
  convertAttributeDefinitionToAttribute,
  mapAttributeDefinitionsToAttributes,
} from '../../../utils/attributes';
import { useProductUpdater } from '../../../hooks/use-product-connector';
import CustomObjectDetails from '../bundle-configuratiom-details';
import {
  AttributeValue,
  SchemaResponse,
} from '../../../hooks/use-schema/types';
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

  const { getAttributes, getProductTypeAttributeDefinitions } =
    useProductTypeConnector();
  const { getProduct } = useProductUpdater();
  const { setValues } = useFormikContext();

  useEffect(() => {
    if (values.mainProductReference?.id) {
      getProduct(values.mainProductReference?.id).then((product) => {
        const productAttributeMap = (
          product.masterData?.current?.masterVariant?.attributes ?? []
        ).reduce((acc, attribute) => {
          return {
            ...acc,
            [attribute.name]:
              typeof attribute.value === 'object' && attribute.value?.key
                ? attribute.value?.key
                : attribute.value,
          };
        }, {});

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
        getAttributes(product.productType?.id).then((attributes) => {
          mapAttributeDefinitionsToAttributes(
            attributes,
            getProductTypeAttributeDefinitions
          ).then((attributes) => {
            setEmptyAttributes(attributes);
          });
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
