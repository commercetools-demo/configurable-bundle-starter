import { Request, Response } from 'express';
import { getProductByID, getProductBySKU } from '../services/product.service';
import {
  getAttributeFromProduct,
  getBundleConfiguration,
  getMatchingSchemas,
  sendSuccessResponse,
} from '../utils/product.utils';
import { resolveProductReferences } from '../utils/bundle.utils';
import { logger } from '../utils/logger.utils';
import { resolveProductTypeReferences } from '../utils/product-type.utils';
import { addBundleToCart } from '../services/cart.service';
import { validateComponentSelections, validateBundleVariantSelections } from '../utils/bundle-validation.utils';

export const getProductBySKUAction = async (
  request: Request,
  response: Response
) => {
  const {
    sku,
    limit,
    offset,
    priceCountry,
    priceCurrency,
    priceCustomerGroup,
    priceChannel,
    storeProjection,
  }: {
    sku?: string;
    limit?: string;
    offset?: string;
    priceCountry?: string;
    priceCurrency?: string;
    priceCustomerGroup?: string;
    priceChannel?: string;
    storeProjection?: string;
  } = request.query;
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
      bundleConfiguration?.value,
      {
        priceCountry,
        priceCurrency,
        priceCustomerGroup,
        priceChannel,
        storeProjection,
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined,
      }
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

export const addToCartAction = async (request: Request, response: Response) => {
  const { cartId, productId, selections } = request.body;
  logger.info(
    `add-to-cart request received for cart: ${cartId}, product: ${productId}`
  );

  // Validate required fields
  if (!cartId || !productId || !selections) {
    response.status(400).json({
      message: 'Missing required fields: cartId, productId, or selections',
      success: false,
    });
    return;
  }

  try {
    // Validate that all selections have valid quantities
    for (const [componentTitle, selection] of Object.entries(selections)) {
      const { quantity } = selection as { quantity: number };
      if (typeof quantity !== 'number' || quantity < 1) {
        response.status(400).json({
          message: `Invalid quantity for component ${componentTitle}`,
          success: false,
        });
        return;
      }
    }

    // Get the original product to validate selections
    const product = await getProductByID(productId);
    if (!product) {
      response.status(404).json({
        message: 'Product not found',
        success: false,
      });
      return;
    }

    // Validate that the selections match the bundle configuration
    const matchingSchemas = await getMatchingSchemas(product);
    const attributesResult = await getAttributeFromProduct(
      product,
      matchingSchemas
    );
    if (!attributesResult) {
      response.status(400).json({
        message: 'Invalid bundle configuration',
        success: false,
      });
      return;
    }

    const { selectedAttribute, matchingSchema } = attributesResult;
    const bundleConfiguration = await getBundleConfiguration(
      selectedAttribute?.value?.id
    );
    
    // Default to empty array for selectionProducts
    let selectionProducts: any[] = [];

    // Determine the bundle configuration type
    const configurationType = matchingSchema?.value?.bundleUISettings?.configurationType || '';

    if (configurationType === 'base-with-addons') {
      // Use bundleVariants validation for base-with-addons type
      const bundleVariants = bundleConfiguration?.value?.bundleConfiguration?.bundleVariants || [];
      
      const validatedProducts = await validateBundleVariantSelections(
        bundleVariants,
        selections,
        response
      );
      
      // Only proceed if validation passed
      if (validatedProducts === null) {
        return;
      }
      
      selectionProducts = validatedProducts;
    } else {
      // Use components_and_parts validation for other types
      const components = bundleConfiguration?.value?.bundleConfiguration?.components_and_parts || [];
      logger.info('components', components);
      
      const validatedProducts = await validateComponentSelections(
        components,
        selections,
        response
      );
      
      // Only proceed if validation passed
      if (validatedProducts === null) {
        return;
      }
      
      selectionProducts = validatedProducts;
    }
    
    
    await addBundleToCart(
      matchingSchema?.value?.addToCartConfiguration as any,
      cartId,
      product,
      selectionProducts
    );

    sendSuccessResponse(response, {
      message: 'Successfully added to cart',
      success: true,
      cartId,
      productId,
      selections,
    });
  } catch (error: any) {
    logger.error('Error adding to cart:', error);
    response.status(500).json({
      message: 'Failed to add items to cart',
      success: false,
      error: error.message,
    });
  }
};
