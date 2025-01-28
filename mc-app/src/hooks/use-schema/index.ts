import {
  useAsyncDispatch,
  actions,
  TSdkAction,
} from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { APP_NAME } from '../../constants';
import { buildUrlWithParams, uniqueId } from '../../utils/utils';
import { PagedQueryResponse, Schema, SchemaResponse } from './types';

export const CONTAINER = `${APP_NAME}_schemas`;
const SCHEMA_KEY_PREFIX = 'schema-';

export const useSchema = () => {
  const context = useApplicationContext((context) => context);

  const dispatchAppsAction = useAsyncDispatch<TSdkAction, SchemaResponse>();
  const dispatchAppsRead = useAsyncDispatch<
    TSdkAction,
    PagedQueryResponse<SchemaResponse>
  >();

  const createScherma = async (payload: Schema): Promise<SchemaResponse> => {
    const key = uniqueId(SCHEMA_KEY_PREFIX);
    const result = await dispatchAppsAction(
      actions.post({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects`,
        payload: {
          container: CONTAINER,
          key,
          value: {
            ...payload,
          } as Schema,
        },
      })
    );
    return result;
  };

  const deleteSchema = async (schemaKey: string): Promise<SchemaResponse> => {
    if (!schemaKey) {
      return {} as SchemaResponse;
    }
    const result = await dispatchAppsAction(
      actions.del({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects/${CONTAINER}/${schemaKey}`,
      })
    );
    return result;
  };

  const getSchema = async (schemaKey: string): Promise<SchemaResponse> => {
    if (!schemaKey) {
      return {} as SchemaResponse;
    }
    const result = await dispatchAppsAction(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects/${CONTAINER}/${schemaKey}`,
      })
    );
    return result;
  };

  const getSchemas = async (): Promise<SchemaResponse[]> => {
    const result = await dispatchAppsRead(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: buildUrlWithParams(
          `/${context?.project?.key}/custom-objects/${CONTAINER}`,
          {}
        ),
      })
    );
    return result?.results;
  };

  const updateSchema = async (
    schemaKey: string,
    schema?: Schema
  ): Promise<SchemaResponse> => {
    if (!schemaKey || !schema) {
      return {} as SchemaResponse;
    }
    const result = await getSchema(schemaKey).then((ds) => {
      return dispatchAppsAction(
        actions.post({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          uri: `/${context?.project?.key}/custom-objects`,
          payload: {
            container: CONTAINER,
            key: schemaKey,
            value: {
              ...ds.value,
              ...schema,
            } as Schema,
          },
        })
      );
    });
    return result;
  };

  return {
    createScherma,
    deleteSchema,
    getSchema,
    getSchemas,
    updateSchema,
  };
};
