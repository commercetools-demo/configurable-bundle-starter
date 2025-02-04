import { mapAttributeDefinitionsToAttributes } from '../utils/attributes';
import { useProductUpdater } from './use-product-connector';
import { useProductTypeConnector } from './use-product-type-connector';
import { AttributeValue } from './use-schema/types';

export const useProductAttributes = () => {
  const { getProduct } = useProductUpdater();
  const { getAttributes, getProductTypeAttributeDefinitions } =
    useProductTypeConnector();

  const getAttributeValueMapByProductId = async (productId?: string) => {
    if (!productId) {
      return {};
    }

    const fullProduct = await getProduct(productId);

    const productAttributeMap = (
      fullProduct.masterData?.current?.masterVariant?.attributes ?? []
    ).reduce((acc, attribute) => {
      return {
        ...acc,
        [attribute.name]:
          typeof attribute.value === 'object' && attribute.value?.key
            ? attribute.value?.key
            : attribute.value,
      };
    }, {});

    return productAttributeMap;
  };

  const getProductAttributeSchemaByProductId = async (
    productId?: string
  ): Promise<AttributeValue[]> => {
    if (!productId) {
      return [];
    }
    const fullProduct = await getProduct(productId);

    return getAttributes(fullProduct.productType?.id).then((attributes) => {
      return mapAttributeDefinitionsToAttributes(
        attributes,
        getProductTypeAttributeDefinitions
      );
    });
  };

  return {
    getAttributeValueMapByProductId,
    getProductAttributeSchemaByProductId,
  };
};
