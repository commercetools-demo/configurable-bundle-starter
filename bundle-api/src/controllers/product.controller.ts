import { Request, Response } from 'express';
import { getProductBySKU } from '../services/product.service';
import {
  getAttributeFromProduct,
  getBundleConfiguration,
  getMatchingSchemas,
  sendSuccessResponse,
} from '../utils/product.utils';
import { resolveProductReferences } from '../utils/bundle.utils';
import { logger } from '../utils/logger.utils';
import { resolveProductTypeReferences } from '../utils/product-type.utils';

export const getProductBySKUAction = async (
  request: Request,
  response: Response
) => {
  const { sku }: { sku?: string } = request.query;
  logger.info(`product-by-sku message received with sku: ${sku}`);

  let product = await getProductBySKU(sku);

  try {
    product = await resolveProductTypeReferences(product);

    const matchingSchemas = await getMatchingSchemas(product);
    const attributesResult = await getAttributeFromProduct(
      product,
      matchingSchemas
    );
    if (!attributesResult) {
      throw new Error('No matching attribute found');
    }
    const { matchingSchema, selectedAttribute } = attributesResult;
    const bundleConfiguration = await getBundleConfiguration(
      selectedAttribute?.value?.id
    );
    const resolvedBundle = await resolveProductReferences(
      matchingSchema?.value,
      bundleConfiguration?.value
    );
    if (product) {
      product.resolvedBundle = resolvedBundle;
      product.bundleSchema = matchingSchema?.value;

      sendSuccessResponse(response, product);
    } else {
      response.json({
        message: 'Product not found',
      });

      response.status(404);
      response.send();
    }
  } catch (error: any) {
    logger.warn(error?.message || error);
    return sendSuccessResponse(response, product);
  }
};
