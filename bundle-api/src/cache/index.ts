import { fetchProductTypesAndCache } from './product-types';
import { fetchSchemaAndCache } from './schema';

export const fetchAllAndCache = async () => {
  await fetchProductTypesAndCache();
  await fetchSchemaAndCache();
};
