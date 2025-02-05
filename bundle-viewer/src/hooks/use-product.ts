import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import {
  useAsyncDispatch,
  actions,
  TSdkAction,
} from '@commercetools-frontend/sdk';
import { Product as CommercetoolsProduct } from '@commercetools/platform-sdk';
import { buildUrlWithParams } from '../utils';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  buildApiUrl,
  executeHttpClientRequest,
} from '@commercetools-frontend/application-shell';
import createHttpUserAgent from '@commercetools/http-user-agent';

const userAgent = createHttpUserAgent({
  name: 'fetch-client',
  version: '1.0.0',
  // @ts-ignore
  libraryName: window.app.applicationName,
  contactEmail: 'support@my-company.com',
});

export const fetcherForwardTo = async (url: string, config: any = {}) => {
  const data = await executeHttpClientRequest(
    async (options) => {
      const res = await fetch(buildApiUrl('/proxy/forward-to'), options);
      const data = res.json();
      return {
        data,
        statusCode: res.status,
        getHeader: (key) => res.headers.get(key),
      };
    },
    {
      userAgent,
      headers: config.headers,
      forwardToConfig: {
        uri: url,
      },
    }
  );
  return data;
};

export const useProduct = () => {
  const dispatchProductRead = useAsyncDispatch<
    TSdkAction,
    CommercetoolsProduct
  >();
  const context = useApplicationContext((context) => context);

  const getProduct = async (id?: string): Promise<CommercetoolsProduct> => {
    const result = await dispatchProductRead(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: buildUrlWithParams(`/${context?.project?.key}/products/${id}`, {}),
      })
    );
    return result;
  };

  const fetchFullProduct = async (sku: string) => {
    return fetcherForwardTo(
      `${context?.environment?.apiEndpoint}/product-by-sku?sku=${sku}`
    );
  };
  const getFullProductByIdAndVariantId = async (
    productId: string,
    variantId: number
  ) => {
    const response = await getProduct(productId);
    const variants = [
      response.masterData.current.masterVariant,
      ...response.masterData.current.variants,
    ];
    const variant = variants.find((variant) => variant.id === variantId);

    const result = await fetchFullProduct(variant?.sku);

    return result;
  };

  return { getFullProductByIdAndVariantId };
};
