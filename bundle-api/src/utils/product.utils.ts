import { Response } from 'express';
import { getCachedSchemas } from '../cache/schema';
import { getBundle } from '../services/bundles.service';
import { ReturningProdct, SchemaCustomObject } from '../types/index.types';
import { Attribute } from '@commercetools/platform-sdk';
const sendResponse = (response: Response, product: any) => {
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

export const getMatchingSchemas = async (response: Response, product?: ReturningProdct) => {
  const cachedSchemas = await getCachedSchemas();
  if (!cachedSchemas) {
    sendResponse(response, product);
    return;
  }

  const matchingSchemas = cachedSchemas.filter((schema: any) => {
    return schema.value?.targetProductTypes?.some(
      (p: any) => p.productType?.id === product?.productType?.id
    );
  });
  if (!matchingSchemas || matchingSchemas.length === 0) {
    sendResponse(response, product);
    return;
  }

  return matchingSchemas;
};

export const getAttributeFromProduct = async (
  response: Response,
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
    sendResponse(response, product);
    return;
  }

  return { matchingSchema, selectedAttribute } as {
    matchingSchema: SchemaCustomObject;
    selectedAttribute: Attribute;
  };
};

export const getBundleConfiguration = async (
  response: Response,
  product?: ReturningProdct,
  id?: string
) => {
  const bundleConfiguration = await getBundle(id);

  if (!bundleConfiguration) {
    sendResponse(response, product);
    return;
  }

  return bundleConfiguration;
};
