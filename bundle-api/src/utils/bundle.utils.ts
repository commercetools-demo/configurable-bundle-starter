import { getProductByID } from '../services/product.service';
import { AttributeValue, Bundle, Schema } from '../types/index.types';
import { logger } from './logger.utils';

interface Product {
  id: string;
}

async function fetchProduct(id: string): Promise<Product> {
  const response = await getProductByID(id);
  if (!response) {
    throw new Error(`Failed to fetch product with id ${id}`);
  }
  return response;
}

async function processAttributes(
  schemaAttributes: AttributeValue[],
  bundleData: Record<string, any>,
  path: string[] = []
): Promise<Record<string, any>> {
  const result: Record<string, any> = { ...bundleData };

  for (const attr of schemaAttributes) {
    const currentPath = [...path, attr.name];
    const value = result[attr.name];

    if (isProductReference(attr)) {
      if (attr.set) {
        const products = await Promise.all(
          value.map(async (item: any) =>
            processProductReference(item, currentPath)
          )
        );

        result[attr.name] = result[attr.name].map(
          (item: any, index: number) => ({
            ...item,
            obj: products[index],
          })
        );
      } else {
        result[attr.name] = {
          ...result[attr.name],
          obj: await processProductReference(value, currentPath),
        };
      }
    } else if (isNestedObject(attr)) {
      result[attr.name] = await processNestedObject(attr, value, currentPath);
    }
  }

  return result;
}

function isProductReference(attr: AttributeValue): boolean {
  return attr.type === 'Reference' && attr.reference?.type === 'product';
}

function isNestedObject(attr: AttributeValue): boolean {
  return attr.type === 'Object' && !!attr.attributes;
}

async function processProductReference(
  value: any,
  path: string[]
): Promise<Product | any> {
  if (!value?.id) {
    return value;
  }

  try {
    return await fetchProduct(value.id);
  } catch (error) {
    logger.error(
      `Failed to resolve product reference at path ${path.join('.')}: ${error}`
    );
    return value;
  }
}

async function processNestedObject(
  attr: AttributeValue,
  value: any,
  currentPath: string[]
): Promise<any> {
  if (!value) {
    return value;
  }

  if (attr.set && Array.isArray(value)) {
    return Promise.all(
      value.map(async (item, index) =>
        processAttributes(attr.attributes!, item, [
          ...currentPath,
          index.toString(),
        ])
      )
    );
  }

  return processAttributes(attr.attributes!, value, currentPath);
}

export async function resolveProductReferences(
  schema: Schema,
  bundle: Bundle
): Promise<Bundle> {
  if (!schema?.attributes || !bundle?.bundleConfiguration) {
    return bundle;
  }

  return {
    ...bundle,
    bundleConfiguration: await processAttributes(
      schema.attributes,
      bundle.bundleConfiguration
    ),
  };
}
