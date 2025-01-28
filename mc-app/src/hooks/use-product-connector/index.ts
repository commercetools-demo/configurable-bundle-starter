import {
  useAsyncDispatch,
  actions,
  TSdkAction,
} from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { extractErrorFromGraphQlResponse } from '../../helpers';
import { Product } from '../../components/organisms/reference-input/search-components/product/types';
import { buildUrlWithParams } from '../../utils/utils';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

export const useProductUpdater = () => {
  const dispatchProductRead = useAsyncDispatch<TSdkAction, Product>();
  const context = useApplicationContext((context) => context);

  const getProduct = async (id?: string): Promise<Product> => {
    const result = await dispatchProductRead(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: buildUrlWithParams(`/${context?.project?.key}/products/${id}`, {}),
      })
    );
    return result;
  };

  const updateProduct = async (
    id: string,
    version: number,
    actionList: any[]
  ) => {
    try {
      return dispatchProductRead(
        actions.post({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          uri: buildUrlWithParams(
            `/${context?.project?.key}/products/${id}`,
            {}
          ),
          payload: {
            version: version,
            actions: actionList,
          },
        })
      );
    } catch (graphQlResponse) {
      throw extractErrorFromGraphQlResponse(graphQlResponse);
    }
  };

  return {
    getProduct,
    updateProduct,
  };
};
