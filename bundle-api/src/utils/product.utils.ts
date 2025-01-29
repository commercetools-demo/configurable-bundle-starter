import { Response } from 'express';
import { getCachedSchemas } from '../cache/schema';
import { getBundle } from '../services/bundles.service';
import { ReturningProdct, SchemaCustomObject } from '../types/index.types';
import { Attribute } from '@commercetools/platform-sdk';
export const sendSuccessResponse = (response: Response, product: any) => {
  if (product) {
    response.json(product);
    response.status(200);
  } else {
    response.json({
      message: 'Product not found',
    });
    response.status(404);
  }
};

export const getMatchingSchemas = async (product?: ReturningProdct) => {
  const cachedSchemas = await getCachedSchemas();
  if (!cachedSchemas) {
    throw new Error('Cached schemas not found');
  }

  const matchingSchemas = cachedSchemas.filter((schema: any) => {
    return schema.value?.targetProductTypes?.some(
      (p: any) => p.productType?.id === product?.productType?.id
    );
  });
  if (!matchingSchemas || matchingSchemas.length === 0) {
    throw new Error('No matching schemas found');
  }

  return matchingSchemas;
};

export const getAttributeFromProduct = async (
  product?: ReturningProdct,
  matchingSchemas?: SchemaCustomObject[]
) => {
  let selectedAttribute: any;
  let matchingSchema: any;
  matchingSchemas?.forEach((schema) => {
    const targetProductType = schema.value?.targetProductTypes?.find(
      (p: any) => p.productType?.id === product?.productType?.id
    );
    if (targetProductType?.attribute) {
      const attribute = product?.masterVariant?.attributes?.find(
        (a: any) => a.name === targetProductType?.attribute
      );
      if (attribute) {
        selectedAttribute = attribute;
        matchingSchema = schema;
        return true;
      }
    }
  });

  if (
    !selectedAttribute ||
    !selectedAttribute?.value ||
    selectedAttribute?.value.typeId !== 'key-value-document' ||
    !selectedAttribute.value.id
  ) {
    throw new Error('No matching attribute found');
  }

  return { matchingSchema, selectedAttribute } as {
    matchingSchema: SchemaCustomObject;
    selectedAttribute: Attribute;
  };
};

export const getBundleConfiguration = async (id?: string) => {
  const bundleConfiguration = await getBundle(id);

  if (!bundleConfiguration) {
    throw new Error('Bundle configuration not found');
  }

  return bundleConfiguration;
};
