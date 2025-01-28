import {
  useAsyncDispatch,
  actions,
  TSdkAction,
} from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { APP_NAME } from '../../constants';
import { uniqueId } from '../../utils/utils';
import { BundleResponse } from './types';
import { BundleFormikValues } from '../../components/molecules/add-new-bundle-button';
import { useProductUpdater } from '../use-product-connector';
import { useSchema } from '../use-schema';

export const CONTAINER = `${APP_NAME}_items`;
const BUNDLE_KEY_PREFIX = 'bundle-';

export const useConfigurableBundles = () => {
  const { updateProduct, getProduct } = useProductUpdater();
  const { getSchema } = useSchema();

  const context = useApplicationContext((context) => context);

  const dispatchAppsAction = useAsyncDispatch<TSdkAction, BundleResponse>();

  const createBundleObject = async (
    payload: BundleFormikValues
  ): Promise<BundleResponse> => {
    const key = uniqueId(BUNDLE_KEY_PREFIX);
    const result = await dispatchAppsAction(
      actions.post({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects`,
        payload: {
          container: CONTAINER,
          key,
          value: {
            ...payload,
          } as BundleFormikValues,
        },
      })
    );
    return result;
  };

  const deleteBundleObject = async (key: string): Promise<BundleResponse> => {
    const result = await dispatchAppsAction(
      actions.del({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects/${CONTAINER}/${key}`,
      })
    );
    return result;
  };

  const createBundle = async (payload: BundleFormikValues): Promise<any> => {
    const schema = await getSchema(payload.bundleType?.value!);
    const productRefInPayload = payload?.createProduct
      ? payload.mainProductCreation
      : payload.mainProductReference;

    const product = await getProduct(productRefInPayload?.id);

    const productRefInSchema = schema?.value?.targetProductTypes?.find(
      (p) => p.productType?.id === product.productType?.id
    );

    if (product && productRefInSchema) {
      const { id, key } = await createBundleObject(payload);

      return updateProduct(product?.id, product.version!, [
        {
          action: 'setAttribute',
          // TODO: read from payload's sku > it should be different based on schema
          sku: product.masterData.current.masterVariant?.sku,
          name: productRefInSchema?.attribute || '',
          value: {
            typeId: 'key-value-document',
            id,
          },
        },
      ]).catch(async (error) => {
        await deleteBundleObject(key);
        throw error;
      });
    }
  };

  return {
    createBundle,
  };
};
