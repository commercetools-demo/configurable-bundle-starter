import { getAllSchemas } from '../services/schemas.service';
import { SchemaCustomObject } from '../types/index.types';
import { logger } from '../utils/logger.utils';

const cache: {
  data: SchemaCustomObject[] | null;
  lastFetched: number | null;
} = {
  data: null,
  lastFetched: null,
};

const CACHE_DURATION = 5 * 60 * 1000;

export async function fetchSchemaAndCache() {
  try {
    const response = await getAllSchemas();
    cache.data = response;
    cache.lastFetched = Date.now();
    return cache.data;
  } catch (error) {
    logger.error('Error fetching data:', error);
    throw error;
  }
}

export async function getCachedSchemas() {
  if (
    cache.data &&
    cache.lastFetched &&
    Date.now() - cache.lastFetched < CACHE_DURATION
  ) {
    return cache.data;
  }

  return await fetchSchemaAndCache();
}
