import {
  getProductByID,
  getProductsByCategoryId,
} from '../services/product.service';
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

async function fetchProductsByCategory(
  categoryId: string,
  offset: number = 0,
  limit: number = 5
): Promise<Product[]> {
  const response = await getProductsByCategoryId(categoryId, offset, limit);
  if (!response) {
    throw new Error(`Failed to fetch products with CategoryId ${categoryId}`);
  }
  return response;
}

async function processAttributes(
  schemaAttributes: AttributeValue[],
  bundleData: Record<string, any>,
  path: string[] = [],
  limit?: number,
  offset?: number
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
    } else if (isCategoryReference(attr)) {
      try {
        if (attr.set) {
          const categoryProducts = await Promise.all(
            value.map(async (item: any) => {
              if (!item?.id) return item;
              const products = await fetchProductsByCategory(
                item.id,
                offset,
                limit
              );
              return {
                ...item,
                obj: products,
              };
            })
          );
          result[attr.name] = categoryProducts;
        } else {
          const products = await fetchProductsByCategory(
            value.id,
            offset,
            limit
          );
          result[attr.name] = {
            ...result[attr.name],
            obj: products,
          };
        }
      } catch (error) {
        logger.error(
          `Failed to fetch products for category at path ${path.join('.')}: ${error}`
        );
      }
    } else if (isNestedObject(attr)) {
      result[attr.name] = await processNestedObject(
        attr,
        value,
        currentPath,
        limit,
        offset
      );
    }
  }

  return result;
}

function isProductReference(attr: AttributeValue): boolean {
  return attr.type === 'Reference' && attr.reference?.type === 'product';
}

function isCategoryReference(attr: AttributeValue): boolean {
  return attr.type === 'Reference' && attr.reference?.type === 'category';
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
  currentPath: string[],
  limit?: number,
  offset?: number
): Promise<any> {
  if (!value) {
    return value;
  }

  if (attr.set && Array.isArray(value)) {
    return Promise.all(
      value.map(async (item, index) =>
        processAttributes(
          attr.attributes!,
          item,
          [...currentPath, index.toString()],
          limit,
          offset
        )
      )
    );
  }

  return processAttributes(attr.attributes!, value, currentPath, limit, offset);
}

export async function resolveProductReferences(
  schema: Schema,
  bundle: Bundle,
  limit?: number,
  offset?: number
): Promise<Bundle> {
  if (!schema?.attributes || !bundle?.bundleConfiguration) {
    return bundle;
  }
  return {
    ...bundle,
    bundleConfiguration: await processAttributes(
      schema.attributes,
      bundle.bundleConfiguration,
      [],
      limit,
      offset
    ),
  };
}
