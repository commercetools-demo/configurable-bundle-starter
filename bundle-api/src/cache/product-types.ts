import { ProductType } from '@commercetools/platform-sdk';
import { logger } from '../utils/logger.utils';
import { getAllProductTypes } from '../services/product-type.service';

const cache: {
  data: ProductType[] | null;
  lastFetched: number | null;
} = {
  data: null,
  lastFetched: null,
};

const CACHE_DURATION = 5 * 60 * 1000;

export async function fetchProductTypesAndCache() {
  try {
    const response = await getAllProductTypes();
    cache.data = response;
    cache.lastFetched = Date.now();
    return cache.data;
  } catch (error) {
    logger.error('Error fetching data:', error);
    throw error;
  }
}

export async function getCachedProductTypes() {
  if (
    cache.data &&
    cache.lastFetched &&
    Date.now() - cache.lastFetched < CACHE_DURATION
  ) {
    return cache.data;
  }

  return await fetchProductTypesAndCache();
}
