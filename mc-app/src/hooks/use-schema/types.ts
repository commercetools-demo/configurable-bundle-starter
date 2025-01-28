import { REFERENCE_TYPES_ENUM, TYPES_ENUM } from '../../utils/contants';

export type Reference = { by: string; type: REFERENCE_TYPES_ENUM };

export type LocalizedEnum = {
  value: string;
  label: { [key: string]: string };
};

export type AttributeValue = {
  name: string;
  type: TYPES_ENUM;
  set?: boolean;
  required?: boolean;
  attributes?: Array<any>;
  reference?: Reference;
  display?: boolean;
  lenum?: Array<LocalizedEnum>;
  enum?: Array<Enum>;
};

export type Enum = {
  value: string;
  label: string;
};

export interface Schema {
  name: string;
  targetProductTypes: {
    productType: {
      typeId: 'product-type';
      id: string;
    };
    attribute: string;
  }[];
  attributes?: AttributeValue[];
}

export interface SchemaResponse {
  id: string;
  createdAt: string;
  key: string;
  value?: Schema;
  container: string;
}

export interface PagedQueryResponse<T> {
  limit: number;
  offset: number;
  count: number;
  total?: number;
  results: T[];
}

export interface QueryResponse<T> {
  body: T;
}
