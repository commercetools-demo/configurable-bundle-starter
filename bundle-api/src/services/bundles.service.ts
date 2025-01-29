import { createApiRoot } from '../client/create.client';
import { BUNDLES_CONTAINER } from '../constants';

export const getBundle = async (id?: string) => {
  if (!id) {
    return null;
  }
  return await createApiRoot()
    .customObjects()
    .withContainer({ container: BUNDLES_CONTAINER })
    .get({
      queryArgs: {
        where: `id = "${id}"`,
      },
    })
    .execute()
    .then((result) => {
      return result.body.count > 0 ? result.body.results[0] : null;
    });
};
