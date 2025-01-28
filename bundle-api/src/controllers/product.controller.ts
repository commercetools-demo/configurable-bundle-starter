import { Request, Response } from 'express';
import { getProductBySKU } from '../services/product.service';

export const getProductBySKUAction = async (request: Request, response: Response) => {
    const product = await getProductBySKU(request);
    if (product) {
      response.json(product);
      response.status(200);
    } else {
      response.json({
        message: 'Product not found',
      });

      response.status(404);
    }
    response.send();
}