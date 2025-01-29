import { getProductByID } from '../services/product.service';
import { AttributeValue, Bundle, Schema } from '../types/index.types';
import { logger } from './logger.utils';

interface Product {
  id: string;
}

export async function resolveProductReferences(
  schema?: Schema,
  bundle?: Bundle
): Promise<Bundle | undefined> {
  const resolvedBundle = structuredClone(bundle); // Deep clone to avoid modifying original

  // Function to fetch product by ID
  async function fetchProduct(id: string): Promise<Product> {
    const response = await getProductByID(id);
    if (!response) {
      throw new Error(`Failed to fetch product with id ${id}`);
    }
    return response
  }

  // Recursive function to process attributes and find references
  async function processAttributes(
    schemaAttributes: AttributeValue[],
    bundleData: Record<string, any>,
    path: string[] = []
  ): Promise<void> {
    for (const attr of schemaAttributes) {
      const currentPath = [...path, attr.name];

      if (attr.type === 'Reference' && attr.reference?.type === 'product') {
        const value = get(bundleData, attr.name);
        if (value?.id) {
          try {
            const product = await fetchProduct(value.id);
            set(bundleData, attr.name, product);
          } catch (error) {
            logger.error(
              `Failed to resolve product reference at path ${currentPath.join('.')}: ${error}`
            );
          }
        }
      } else if (attr.type === 'Object' && attr.attributes) {
        const nestedData = get(bundleData, attr.name);

        if (attr.set && Array.isArray(nestedData)) {
          // Handle array of objects
          for (let i = 0; i < nestedData.length; i++) {
            await processAttributes(attr.attributes, nestedData[i], [
              ...currentPath,
              i.toString(),
            ]);
          }
        } else if (nestedData) {
          // Handle single object
          await processAttributes(attr.attributes, nestedData, currentPath);
        }
      }
    }
  }

  // Helper function to safely get nested object properties
  function get(obj: any, path: string): any {
    return obj[path];
  }

  // Helper function to safely set nested object properties
  function set(obj: any, path: string, value: any): void {
    obj[path] = value;
  }

  if (!schema?.attributes || !resolvedBundle?.bundleConfiguration) {
    return resolvedBundle;
  }

  await processAttributes(
    schema.attributes || [],
    resolvedBundle.bundleConfiguration
  );
  return resolvedBundle;
}
