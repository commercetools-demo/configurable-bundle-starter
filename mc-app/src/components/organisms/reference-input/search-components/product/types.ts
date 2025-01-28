import { TEntity } from '../../types';

export interface Product extends TEntity {
  version?: number;
  productType: {
    key?: string;
    id?: string;
  };
  masterData: {
    current: {
      name?: string;
      masterVariant?: {
        sku?: string;
      };
    };
  };
}

export interface ProductProjectionItem extends TEntity {
  productType: {
    key?: string;
  };
  masterVariant?: {
    sku?: string;
  };
}
