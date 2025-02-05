// Make sure to import the helper functions from the `ssr` entry point.
import { entryPointUriPathToPermissionKeys } from '@commercetools-frontend/application-shell/ssr';

export const entryPointUriPath = 'starter-typescript-735750';

export const PERMISSIONS = entryPointUriPathToPermissionKeys(entryPointUriPath);

export const APP_NAME = 'configurable-bundles';

export const FEATURE_FLAGS_ENUM = {
  CUSTOM_OBJECT_BUNDLE: 'custom-object-bundle',
  PRODUCT_ATTRIBUTE_BUNDLE: 'product-attribute-bundle',
};
