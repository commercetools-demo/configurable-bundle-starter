import { CustomObject, ProductProjection } from '@commercetools/platform-sdk';
import { REFERENCE_TYPES_ENUM, TYPES_ENUM } from '../constants';

export type Message = {
  code: string;
  message: string;
  referencedBy: string;
};

export type ValidatorCreator = (
  path: string[],
  message: Message,
  overrideConfig?: object
) => [string[], [[(o: object) => boolean, string, [object]]]];

export type ValidatorFunction = (o: object) => boolean;

export type Wrapper = (
  validator: ValidatorFunction
) => (value: object) => boolean;

export type Reference = { by: string; type: REFERENCE_TYPES_ENUM };

export type AttributeValue = {
  name: string;
  type: TYPES_ENUM;
  set?: boolean;
  required?: boolean;
  attributes?: Array<any>;
  reference?: Reference;
  display?: boolean;
};

export type ProductProjectionSearchOptions = {
  priceCountry?: string;
  priceCurrency?: string;
  priceCustomerGroup?: string;
  priceChannel?: string;
  storeProjection?: string;
  limit?: number;
  offset?: number;
};

export interface SchemaCustomObject extends CustomObject {
  value: Schema;
}

export interface Schema {
  name: string;
  addToCartConfiguration: {
    type: string;
    customType?: {
      typeId: string;
      id: string;
    };
    customTypeField?: string;
  };
  targetProductTypes: {
    productType: {
      typeId: 'product-type';
      id: string;
    };
    attribute: string;
  }[];
  attributes?: AttributeValue[];
  bundleUISettings?: {
    configurationType?: string;
    displayMode?: string;
    displayModeProperties?: {
      allowSkipSteps?: boolean;
    };
  };
}

export type Bundle = {
  createProduct: boolean;
  selectProduct: boolean;
  bundleType?: {
    label: string;
    value: string;
  };
  bundleConfiguration?: {
    components_and_parts?: any[];
    bundleVariants?: any[];
    [key: string]: any;
  };
  mainProductReference?: {
    id?: string;
  };
};

export interface ReturningProdct extends ProductProjection {
  resolvedBundle?: Bundle;
  bundleSchema?: Schema;
}
