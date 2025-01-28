import { BundleFormikValues } from '../../components/molecules/add-new-bundle-button';

export interface BundleResponse {
  id: string;
  createdAt: string;
  key: string;
  value?: BundleFormikValues;
  container: string;
}

export interface PagedQueryResponse<T> {
  limit: number;
  offset: number;
  count: number;
  total?: number;
  results: T[];
}
