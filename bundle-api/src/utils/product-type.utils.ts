import {
  Attribute,
  AttributeDefinition,
  ProductProjection,
  ProductType,
  ProductVariant,
} from '@commercetools/platform-sdk';
import { getProductByID } from '../services/product.service';
import { getCachedProductTypes } from '../cache/product-types';

// Helper Functions
async function fetchProduct(id: string): Promise<ProductProjection> {
  const response = await getProductByID(id, true);
  if (!response) {
    throw new Error(`Failed to fetch product with id ${id}`);
  }
  return resolveProductTypeReferences(response);
}

function findProductTypeById(
  productTypes: Array<ProductType>,
  id: string
): ProductType | undefined {
  return productTypes.find((pt) => pt.id === id);
}

function isProductReference(type: AttributeDefinition['type']): boolean {
  return (
    (type.name === 'reference' && type.referenceTypeId === 'product') ||
    (type.name === 'set' &&
      type.elementType?.name === 'reference' &&
      type.elementType?.referenceTypeId === 'product')
  );
}

async function resolveProductAttribute(
  attribute: Attribute,
  attributeDef: AttributeDefinition
): Promise<Attribute> {
  if (!isProductReference(attributeDef.type)) {
    return attribute;
  }

  const isSet = attributeDef.type.name === 'set';
  const newValue = isSet
    ? await Promise.all(
        (attribute.value as Array<{ id: string; typeId: string }>).map((ref) =>
          fetchProduct(ref.id)
        )
      )
    : await fetchProduct(
        (attribute.value as { id: string; typeId: string }).id
      );

  return {
    ...attribute,
    value: newValue,
  };
}

async function resolveNestedTypeReferences(
  attribute: Attribute,
  attributeDef: AttributeDefinition,
  productTypes: Array<ProductType>
): Promise<Attribute> {
  if (
    attributeDef.type.name !== 'set' ||
    attributeDef.type.elementType?.name !== 'nested'
  ) {
    return attribute;
  }

  const nestedTypeId = attributeDef.type.elementType?.typeReference?.id;
  if (!nestedTypeId) {
    return attribute;
  }

  const nestedType = findProductTypeById(productTypes, nestedTypeId);
  if (!nestedType) {
    return attribute;
  }

  const resolvedValue = await Promise.all(
    (attribute.value as Array<Array<Attribute>>).map(async (nestedAttrs) => {
      const resolvedNestedAttrs = await Promise.all(
        nestedAttrs.map(async (nestedAttr) => {
          const nestedAttrDef = (nestedType.attributes || []).find(
            (def) => def.name === nestedAttr.name
          );
          if (!nestedAttrDef) {
            return nestedAttr;
          }
          return resolveProductAttribute(nestedAttr, nestedAttrDef);
        })
      );
      return resolvedNestedAttrs;
    })
  );

  return {
    ...attribute,
    value: resolvedValue,
  };
}

async function resolveVariantReferences(
  variant: ProductVariant,
  productType: ProductType,
  productTypes: Array<ProductType>
): Promise<ProductVariant> {
  const resolvedAttributes = await Promise.all(
    (variant.attributes || []).map(async (attr) => {
      const attrDef = (productType.attributes || []).find(
        (def) => def.name === attr.name
      );
      if (!attrDef) {
        return attr;
      }

      const resolvedAttr = await resolveProductAttribute(attr, attrDef);
      return resolveNestedTypeReferences(resolvedAttr, attrDef, productTypes);
    })
  );

  return {
    ...variant,
    attributes: resolvedAttributes,
  };
}

async function resolveProductTypeReferences(
  product?: ProductProjection
): Promise<ProductProjection> {
  if (!product) {
    throw new Error('Product not found');
  }
  const productTypes = await getCachedProductTypes();
  const productType = findProductTypeById(productTypes, product.productType.id);
  if (!productType) {
    throw new Error(`Product type ${product.productType.id} not found`);
  }

  const resolvedMasterVariant = await resolveVariantReferences(
    product.masterVariant,
    productType,
    productTypes
  );

  const resolvedVariants = await Promise.all(
    product.variants.map((variant) =>
      resolveVariantReferences(variant, productType, productTypes)
    )
  );

  return {
    ...product,
    masterVariant: resolvedMasterVariant,
    variants: resolvedVariants,
  };
}

export { resolveProductTypeReferences };
