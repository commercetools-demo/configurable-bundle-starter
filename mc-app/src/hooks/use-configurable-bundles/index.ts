import {
  useAsyncDispatch,
  actions,
  TSdkAction,
} from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { APP_NAME } from '../../constants';
import { uniqueId } from '../../utils/utils';
import { BundleResponse, PagedQueryResponse } from './types';
import { BundleFormikValues } from '../../components/molecules/add-new-bundle-button';
import { useProductUpdater } from '../use-product-connector';
import { useSchema } from '../use-schema';
import { CONFIGURATION_TYPES_ENUM } from '../../utils/contants';
import {
  convertAttributeMapToAttributes,
  filterEmptyAttribute,
} from '../../utils/attributes';

export const CONTAINER = `${APP_NAME}_items`;
const BUNDLE_KEY_PREFIX = 'bundle-';

export const useConfigurableBundles = () => {
  const { updateProduct, getProduct } = useProductUpdater();
  const { getSchema } = useSchema();

  const context = useApplicationContext((context) => context);

  const dispatchAppsAction = useAsyncDispatch<TSdkAction, BundleResponse>();
  const dispatchAppsQuery = useAsyncDispatch<
    TSdkAction,
    PagedQueryResponse<BundleResponse>
  >();

  const createBundleObject = async (
    payload: BundleFormikValues
  ): Promise<BundleResponse> => {
    const key = uniqueId(BUNDLE_KEY_PREFIX);
    return updateBundleObject(key, payload);
  };

  const updateBundleObject = async (
    key: string,
    payload: BundleFormikValues
  ): Promise<BundleResponse> => {
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
    if (!payload.mainProductReference?.id) {
      throw new Error('Please select a product');
    }
    const product = await getProduct(payload.mainProductReference?.id);

    if (payload.configurationType === CONFIGURATION_TYPES_ENUM.CUSTOM_OBJECT) {
      const schema = await getSchema(payload.bundleType?.value!);

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
            staged: false,
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
    } else if (payload.configurationType === CONFIGURATION_TYPES_ENUM.PRODUCT) {
      const attributes = convertAttributeMapToAttributes(
        payload.mainProductReference?.masterVariant?.attributes || {}
      );
      return updateProduct(
        product?.id,
        product.version!,
        attributes.filter(filterEmptyAttribute).map((attr) => ({
          action: 'setAttribute',
          sku: product.masterData.current.masterVariant?.sku,
          name: attr.name,
          staged: false,
          value: attr.value,
        }))
      );
    }
  };

  const updateBundle = async (
    key: string,
    payload: BundleFormikValues
  ): Promise<any> => {
    if (!payload.mainProductReference?.id) {
      throw new Error('Please select a product');
    }
    const product = await getProduct(payload.mainProductReference?.id);

    if (payload.configurationType === CONFIGURATION_TYPES_ENUM.CUSTOM_OBJECT) {
      const schema = await getSchema(payload.bundleType?.value!);

      const productRefInSchema = schema?.value?.targetProductTypes?.find(
        (p) => p.productType?.id === product.productType?.id
      );

      if (product && productRefInSchema) {
        const { id } = await updateBundleObject(key, payload);

        return updateProduct(product?.id, product.version!, [
          {
            action: 'setAttribute',
            // TODO: read from payload's sku > it should be different based on schema
            sku: product.masterData.current.masterVariant?.sku,
            name: productRefInSchema?.attribute || '',
            staged: false,
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
    } else if (payload.configurationType === CONFIGURATION_TYPES_ENUM.PRODUCT) {
      const attributes = convertAttributeMapToAttributes(
        payload.mainProductReference?.masterVariant?.attributes || {}
      );
      return updateProduct(
        product?.id,
        product.version!,
        attributes.filter(filterEmptyAttribute).map((attr) => ({
          action: 'setAttribute',
          sku: product.masterData.current.masterVariant?.sku,
          name: attr.name,
          staged: false,
          value: attr.value,
        }))
      );
    }
  };

  const getBundles = async (): Promise<BundleResponse[]> => {
    const result = await dispatchAppsQuery(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects/${CONTAINER}`,
      })
    );
    return result.results;
  };

  const getBundle = async (key: string): Promise<BundleResponse> => {
    const result = await dispatchAppsAction(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects/${CONTAINER}/${key}`,
      })
    );
    return result;
  };

  return {
    createBundle,
    updateBundle,
    getBundles,
    getBundle,
  };
};
