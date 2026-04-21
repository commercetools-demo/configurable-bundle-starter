import { useQuery } from '@apollo/client';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Text from '@commercetools-uikit/text';
import { DocumentNode } from '@apollo/client';
import { ReactNode } from 'react';
import { TEntity } from '../types';

interface ReferenceTextValueProps<T extends TEntity> {
  value?: T | null;
  referenceBy: 'id' | 'key';
  byIdQuery: DocumentNode;
  byKeyQuery: DocumentNode;
  singleValueQueryDataObject: string;
  localizePath: (value: T, ...args: any[]) => string | undefined;
  loadingFallback?: ReactNode;
}

export const ReferenceTextValue = <T extends TEntity>({
  value,
  referenceBy,
  byIdQuery,
  byKeyQuery,
  singleValueQueryDataObject,
  localizePath,
  loadingFallback,
}: ReferenceTextValueProps<T>) => {
  const { dataLocale } = useApplicationContext((ctx) => ({
    dataLocale: ctx.dataLocale ?? '',
  }));

  const idOrKey = value?.[referenceBy as keyof T] as string | undefined;

  const { data, loading } = useQuery<Record<string, any>>(
    referenceBy === 'key' ? byKeyQuery : byIdQuery,
    {
      variables: { [referenceBy]: idOrKey, locale: dataLocale },
      context: { target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM },
      skip: !idOrKey,
    }
  );

  if (!idOrKey) return <span>—</span>;
  if (loading) return <>{loadingFallback ?? <LoadingSpinner />}</>;

  const entity = data?.[singleValueQueryDataObject];
  if (!entity) return <span>{idOrKey}</span>;

  return <Text.Body>{localizePath(entity) ?? idOrKey}</Text.Body>;
};
