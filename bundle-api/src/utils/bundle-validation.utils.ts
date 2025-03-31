import { Response } from 'express';
import { getProductByID } from '../services/product.service';
import { logger } from './logger.utils';

/**
 * Validates selections against components_and_parts configuration
 * 
 * @param components Array of bundle components
 * @param selections User selections
 * @param response Express response object for error responses
 * @returns Array of selected products with quantities or null if validation failed
 */
export const validateComponentSelections = async (
  components: any[],
  selections: Record<string, any>,
  response: Response
) => {
  const selectionProducts = [];

  for await (const component of components) {
    const selection = selections[component.title];
    logger.info('selection', selection);
    
    // Check if component is mandatory (mandatoryQuantity > 0) and has a selection
    if (component.mandatoryQuantity > 0 && !selection) {
      response.status(400).json({
        message: `Missing selection for mandatory component: ${component.title}`,
        success: false,
      });
      return null;
    }

    // Validate quantity limits if there is a selection
    if (selection) {
      if (
        selection.quantity < component.mandatoryQuantity ||
        selection.quantity > component.maxQuantity
      ) {
        response.status(400).json({
          message: `Invalid quantity for component ${component.title}. Must be between ${component.mandatoryQuantity} and ${component.maxQuantity}`,
          success: false,
        });
        return null;
      }

      // Validate that the selected product is in the allowed products list
      const validProductIds = component.productselectableProducts.map(
        (p: any) => p.id
      );
      if (!validProductIds.includes(selection.productId)) {
        response.status(400).json({
          message: `Invalid product selection for component ${component.title}`,
          success: false,
        });
        return null;
      }
      selectionProducts.push({
        product: await getProductByID(selection.productId),
        quantity: selection.quantity,
      });
    }
  }

  return selectionProducts;
};

/**
 * Validates selections against bundleVariants configuration
 * 
 * @param bundleVariants Array of bundle variants
 * @param selections User selections
 * @param response Express response object for error responses
 * @returns Array of selected products with quantities or null if validation failed
 */
export const validateBundleVariantSelections = async (
  bundleVariants: any[],
  selections: Record<string, any>,
  response: Response
) => {
  if (!bundleVariants || bundleVariants.length === 0) {
    response.status(400).json({
      message: 'No bundle variants defined in configuration',
      success: false,
    });
    return null;
  }

  // For bundleVariants, we need to check if the selections match any defined variant
  const selectionProducts = [];
  const selectedProductIds = new Set(Object.values(selections).map((sel: any) => sel.productId));

  // Find matching variant based on product selections
  let matchFound = false;
  let matchingVariant = null;

  for (const variant of bundleVariants) {
    const variantProductIds = new Set(variant.product.map((p: any) => p.id));
    
    // Check if selection matches this variant (all products in selection must be in variant)
    const isMatch = [...selectedProductIds].every(id => variantProductIds.has(id));
    
    // Check if all variant products are in the selection when variant is selected
    const allVariantProductsSelected = [...variantProductIds].every(id => selectedProductIds.has(id));
    
    if (isMatch && allVariantProductsSelected) {
      matchFound = true;
      matchingVariant = variant;
      break;
    }
  }

  if (!matchFound) {
    response.status(400).json({
      message: 'Selections do not match any defined bundle variant',
      success: false,
    });
    return null;
  }

  // Add all products from matching variant to the selection products
  for (const productRef of matchingVariant.product) {
    const selection = Object.values(selections).find(
      (sel: any) => sel.productId === productRef.id
    );
    
    if (!selection) {
      response.status(400).json({
        message: `Missing selection for product in bundle variant: ${productRef.id}`,
        success: false,
      });
      return null;
    }
    
    selectionProducts.push({
      product: await getProductByID(productRef.id),
      quantity: selection.quantity,
    });
  }

  return selectionProducts;
}; 