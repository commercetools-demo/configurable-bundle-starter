import { Router } from 'express';
import { logger } from '../utils/logger.utils';
import { getProductBySKUAction } from '../controllers/product.controller';

const serviceRouter = Router();

serviceRouter.get('/product-by-sku', async (req, res, next) => {
  logger.info('product-by-sku message received');

  try {
    getProductBySKUAction(req, res);
  } catch (error) {
    next(error);
  }
});

export default serviceRouter;
