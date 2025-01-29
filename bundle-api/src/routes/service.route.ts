import { Router } from 'express';
import { getProductBySKUAction } from '../controllers/product.controller';

const serviceRouter = Router();

serviceRouter.get('/product-by-sku', async (req, res, next) => {
  try {
    getProductBySKUAction(req, res);
  } catch (error) {
    next(error);
  }
});

export default serviceRouter;
