export interface Attribute {
  name: string;
  type: string;
  set: boolean;
  required: boolean;
  attributes?: Attribute[];
}

export interface Schema {
  name: string;
  attributes?: Attribute[];
}

export interface SchemaResponse {
  id: string;
  createdAt: string;
  key: string;
  value?: Schema;
}

export interface PagedQueryResponse<T> {
  limit: number;
  offset: number;
  count: number;
  total?: number;
  results: T[];
}
