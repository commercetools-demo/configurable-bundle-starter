import { Request } from 'express';
import { createApiRoot } from '../client/create.client';

export const getProductBySKU = async (request: Request) => {
  const { sku } = request.query;
  if (sku) {
    return await createApiRoot()
      .productProjections()
      .search()
      .get({
        queryArgs: {
          filter: `variants.sku: "${sku}"`,
        },
      })
      .execute()
      .then((result) => {
        return result.body.count > 0 ? result.body.results[0] : null;
      });
  }

  return null;
};
