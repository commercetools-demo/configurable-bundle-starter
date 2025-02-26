import { createApiRoot } from '../client/create.client';
import { ProductProjectionSearchOptions, ReturningProdct } from '../types/index.types';

export const getProductBySKU = async (
  sku?: string
): Promise<ReturningProdct | undefined> => {
  if (sku) {
    return createApiRoot()
      .productProjections()
      .search()
      .get({
        queryArgs: {
          filter: `variants.sku: "${sku}"`,
        },
      })
      .execute()
      .then((result) => {
        return result.body.count > 0 ? result.body.results[0] : undefined;
      });
  }

  return undefined;
};

export const getProductByID = async (id?: string, staged = false, options?: ProductProjectionSearchOptions) => {
  if (id) {
    return await createApiRoot()
      .productProjections()
      .withId({ ID: id })
      .get({
        queryArgs: {
          staged,
          ...(options && { ...options }),
        },
      })
      .execute()
      .then((result) => {
        return result.body;
      });
  }

  return null;
};

export const getProductsByCategoryId = async (
  categoryId: string,
  options?: ProductProjectionSearchOptions
) => {
  if (categoryId) {
    return await createApiRoot()
      .productProjections()
      .get({
        queryArgs: {
          filter: `categories.id: "${categoryId}"`,
          ...(options && { ...options }),
        },
      })
      .execute()
      .then((result) => {
        return result.body.results;
      });
  }

  return null;
};
