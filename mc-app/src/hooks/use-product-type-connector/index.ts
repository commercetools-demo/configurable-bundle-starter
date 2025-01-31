import {
  useAsyncDispatch,
  actions,
  TSdkAction,
} from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { buildUrlWithParams } from '../../utils/utils';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  Attribute,
  AttributeConstraintEnum,
  AttributeDefinition,
  ProductType,
} from '@commercetools/platform-sdk';
import { PagedQueryResponse } from '../use-configurable-bundles/types';

export const useProductTypeConnector = () => {
  const dispatchProductsRead = useAsyncDispatch<
    TSdkAction,
    PagedQueryResponse<ProductType>
  >();
  const dispatchProductTypeRead = useAsyncDispatch<TSdkAction, ProductType>();
  const context = useApplicationContext((context) => context);

  const getProductTypes = async (): Promise<ProductType[]> => {
    const result = await dispatchProductsRead(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: buildUrlWithParams(`/${context?.project?.key}/product-types`, {}),
      })
    );
    return result?.results;
  };

  const getAttributes = async (
    id?: string,
    isRequired?: boolean,
    attributeConstraints?: AttributeConstraintEnum[]
  ): Promise<AttributeDefinition[]> => {
    if (!id) return [];
    const result = await dispatchProductTypeRead(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: buildUrlWithParams(
          `/${context?.project?.key}/product-types/${id}`,
          {}
        ),
      })
    );

    let attributes = result.attributes ?? [];
    if (typeof isRequired !== 'undefined') {
      attributes = attributes?.filter(
        (attr: AttributeDefinition) => attr.isRequired === isRequired
      );
    }
    if (
      typeof attributeConstraints !== 'undefined' &&
      attributeConstraints.length > 0
    ) {
      attributes = attributes?.filter((attr: AttributeDefinition) =>
        attributeConstraints.includes(attr.attributeConstraint)
      );
    }

    return attributes;
  };

  return {
    getProductTypes,
    getAttributes,
  };
};
