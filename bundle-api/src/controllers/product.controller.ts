import { Request, Response } from 'express';
import { getProductBySKU } from '../services/product.service';
import {
  getAttributeFromProduct,
  getBundleConfiguration,
  getMatchingSchemas,
} from '../utils/product.utils';
import { resolveProductReferences } from '../utils/bundle.utils';

export const getProductBySKUAction = async (
  request: Request,
  response: Response
) => {
  const { sku }: { sku?: string } = request.query;
  const product = await getProductBySKU(sku);
  const matchingSchemas = await getMatchingSchemas(response, product);
  const attributesResult = await getAttributeFromProduct(
    response,
    product,
    matchingSchemas
  );
  if (!attributesResult) {
    response.json(product);
    response.status(200);
    return;
  }
  const { matchingSchema, selectedAttribute } = attributesResult;
  const bundleConfiguration = await getBundleConfiguration(
    response,
    product,
    selectedAttribute?.value?.id
  );

  const resolvedBundle = await resolveProductReferences(
    matchingSchema?.value,
    bundleConfiguration?.value
  );

  // GET

  if (product) {
    product.resolvedBundle = resolvedBundle;
    product.bundleSchema = matchingSchema?.value;
    response.json(product);
    response.status(200);
  } else {
    response.json({
      message: 'Product not found',
    });

    response.status(404);
  }
  response.send();
};
