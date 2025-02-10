import { CartAddLineItemAction, Product, ProductProjection } from '@commercetools/platform-sdk';
import { createApiRoot } from '../client/create.client';

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
    }).catch((error) => {
      console.error(error);
      return null;
    });
};

const updateCart = async (cartId: string, version: number, actions: CartAddLineItemAction[]) => {
  return createApiRoot()
    .carts()
    .withId({ ID: cartId })
    .post({ body: { version, actions } })
    .execute();
};


export const addBundleToCart = async (cartId: string, product: ProductProjection, selections: {product: ProductProjection | null, quantity: number}[]) => {
  const cart = await getCartById(cartId);
  if (!cart) {
    throw new Error('Cart not found');
  }

  const updatedCart = await updateCart(cartId, cart.version, [{
    action: 'addLineItem',
    productId: product.id,
    quantity: 1,
  }]);


  const actions: CartAddLineItemAction[] = ;
  selections.forEach((selection) => {
    actions.push({
      action: 'addLineItem',
      productId: selection.product?.id,
      quantity: selection.quantity,
    });
  });
  
  return updatedCart;
};