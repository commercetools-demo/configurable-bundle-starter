import { Router } from 'express';
import { addToCartAction, getProductBySKUAction } from '../controllers/product.controller';

const serviceRouter = Router();

serviceRouter.get('/product-by-sku', async (req, res, next) => {
  try {
    getProductBySKUAction(req, res);
  } catch (error) {
    next(error);
  }
});

serviceRouter.post('/add-to-cart', async (req, res, next) => {
  try {
    addToCartAction(req, res);
  } catch (error) {
    next(error);
  }
});

export default serviceRouter;
