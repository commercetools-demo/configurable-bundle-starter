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

export const getProductByID = async (id?: string) => {
  if (id) {
    return await createApiRoot()
      .productProjections()
      .withId({ ID: id })
      .get()
      .execute()
      .then((result) => {
        return result.body;
      });
  }

  return null;
};
