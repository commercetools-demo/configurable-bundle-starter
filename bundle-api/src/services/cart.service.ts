import {
  CartAddLineItemAction,
  Product,
  ProductProjection,
} from '@commercetools/platform-sdk';
import { createApiRoot } from '../client/create.client';
import { logger } from '../utils/logger.utils';

export const getCartById = async (id?: string) => {
  if (!id) {
    return null;
  }
  return await createApiRoot()
    .carts()
    .withId({ ID: id })
    .get()
    .execute()
    .then((result) => {
      return result.body;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
};

const updateCart = async (
  cartId: string,
  version: number,
  actions: CartAddLineItemAction[]
) => {
  return createApiRoot()
    .carts()
    .withId({ ID: cartId })
    .post({ body: { version, actions } })
    .execute();
};

export const addBundleToCart = async (
  addToCartConfiguration: {
    type: string;
    customType: {
      typeId: string;
      id: string;
    };
    customTypeField: string;
  },
  cartId: string,
  product: ProductProjection,
  selections: { product: ProductProjection | null; quantity: number }[]
) => {
  logger.info('addToCartConfiguration',addToCartConfiguration);
  logger.info('selections',selections);
  logger.info('product',product);
  const cart = await getCartById(cartId);
  if (!cart) {
    throw new Error('Cart not found');
  }

  const bundleId = `bundle-${Date.now()}`;
  const key = bundleId;

  let updatedCart = await updateCart(cartId, cart.version, [
    {
      action: 'addLineItem',
      productId: product.id,
      quantity: 1,
      key,
    },
  ]);

  if (updatedCart && addToCartConfiguration?.type === 'add-with-parent-link') {
    const actions: CartAddLineItemAction[] = [];
    selections.forEach((selection) => {
      actions.push({
        action: 'addLineItem',
        productId: selection.product?.id,
        quantity: selection.quantity,
        custom: {
          type: {
            typeId: 'type',
            id: addToCartConfiguration.customType.id,
          },
          fields: {
            [addToCartConfiguration.customTypeField]: key,
          },
        },
      });
    });

    updatedCart = await updateCart(cartId, updatedCart.body.version, actions);
  }
  return updatedCart;
};
