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

export const addToCartAction = async (request: Request, response: Response) => {
  const { cartId, productId, selections } = request.body;
  logger.info(`add-to-cart request received for cart: ${cartId}, product: ${productId}`);

  // Validate required fields
  if (!cartId || !productId || !selections) {
    response.status(400).json({
      message: 'Missing required fields: cartId, productId, or selections',
      success: false
    });
    return;
  }

  

  try {
    // Validate that all selections have valid quantities
    for (const [componentTitle, selection] of Object.entries(selections)) {
      const { quantity } = selection;
      if (typeof quantity !== 'number' || quantity < 1) {
        response.status(400).json({
          message: `Invalid quantity for component ${componentTitle}`,
          success: false
        });
        return;
      }
    }

    // Get the original product to validate selections
    const product = await getProductByID(productId);
    if (!product) {
      response.status(404).json({
        message: 'Product not found',
        success: false
      });
      return;
    }

    // // Validate that the selections match the bundle configuration
    const matchingSchemas = await getMatchingSchemas(product);
    const attributesResult = await getAttributeFromProduct(product, matchingSchemas);
    if (!attributesResult) {
      response.status(400).json({
        message: 'Invalid bundle configuration',
        success: false
      });
      return;
    }

    const { selectedAttribute } = attributesResult;
    const bundleConfiguration = await getBundleConfiguration(selectedAttribute?.value?.id);
    const selectionProducts = [];

    
    // Validate that all required components have selections
    const components = bundleConfiguration?.value?.bundleConfiguration?.components_and_parts || [];
    for await (const component of components) {
      const selection = selections[component.title];
      
      // Check if component is mandatory (mandatoryQuantity > 0) and has a selection
      if (component.mandatoryQuantity > 0 && !selection) {
        response.status(400).json({
          message: `Missing selection for mandatory component: ${component.title}`,
          success: false
        });
        return;
      }

      // Validate quantity limits if there is a selection
      if (selection) {
        if (selection.quantity < component.mandatoryQuantity || 
            selection.quantity > component.maxQuantity) {
          response.status(400).json({
            message: `Invalid quantity for component ${component.title}. Must be between ${component.mandatoryQuantity} and ${component.maxQuantity}`,
            success: false
          });
          return;
        }

        // Validate that the selected product is in the allowed products list
        const validProductIds = component.productselectableProducts.map(p => p.id);
        if (!validProductIds.includes(selection.productId)) {
          response.status(400).json({
            message: `Invalid product selection for component ${component.title}`,
            success: false
          });
          return;
        }
        selectionProducts.push({
          product: await getProductByID(selection.productId),
          quantity: selection.quantity
        });
      }
    }

    

    // TODO: Add your cart service call here to actually add the items to the cart
    // const cartService = new CartService();
    await addBundleToCart(cartId, product, selectionProducts);

    sendSuccessResponse(response, {
      message: 'Successfully added to cart',
      success: true,
      cartId,
      productId,
      selections
    });

  } catch (error: any) {
    logger.error('Error adding to cart:', error);
    response.status(500).json({
      message: 'Failed to add items to cart',
      success: false,
      error: error.message
    });
  }
};
