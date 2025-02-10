import { ProductType } from '@commercetools/platform-sdk';
import { createApiRoot } from '../client/create.client';

export const getAllProductTypes = async (): Promise<ProductType[]> => {
  return await createApiRoot()
    .productTypes()
    .get({
      queryArgs: {
        limit: 500,
      },
    })
    .execute()
    .then((result) => {
      return result.body.count > 0 ? result.body.results : [];
    });
};
