import { createApiRoot } from '../client/create.client';
import { SCHEMAS_CONTAINER } from '../constants';
import { SchemaCustomObject } from '../types/index.types';

export const getAllSchemas = async (): Promise<SchemaCustomObject[]> => {
  return await createApiRoot()
    .customObjects()
    .withContainer({ container: SCHEMAS_CONTAINER })
    .get()
    .execute()
    .then((result) => {
      return result.body.count > 0 ? result.body.results : [];
    });
};
