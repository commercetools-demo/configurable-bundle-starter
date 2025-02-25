import { createApiRoot } from '../client/create.client';
import { ReturningProdct } from '../types/index.types';

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

export const getProductByID = async (id?: string, staged = false) => {
  if (id) {
    return await createApiRoot()
      .productProjections()
      .withId({ ID: id })
      .get({
        queryArgs: {
          staged,
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
  offset: number = 0,
  limit: number = 20
) => {
  if (categoryId) {
    return await createApiRoot()
      .productProjections()
      .get({
        queryArgs: {
          filter: `categories.id: "${categoryId}"`,
          offset,
          limit,
        },
      })
      .execute()
      .then((result) => {
        return result.body.results;
      });
  }

  return null;
};
