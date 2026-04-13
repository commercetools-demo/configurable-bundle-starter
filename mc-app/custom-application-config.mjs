import { PERMISSIONS } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name: 'Configurable bundles',
  entryPointUriPath: '${env:ENTRY_POINT_URI_PATH}',
  cloudIdentifier: '${env:CLOUD_IDENTIFIER}',
  env: {
    production: {
      applicationId: '${env:CUSTOM_APPLICATION_ID}',
      url: '${env:APPLICATION_URL}',
    },
    development: {
      initialProjectKey: '${env:INITIAL_PROJECT_KEY}',
    },
  },
  additionalEnv: {
    featureFlags: '${env:BUNDLE_FEATURE_FLAGS}',
  },
  oAuthScopes: {
    view: ['view_products', 'view_types', 'view_key_value_documents'],
    manage: ['manage_products', 'manage_key_value_documents'],
  },
  icon: '${path:@tabler/icons/outline/chart-bubble.svg}',
  mainMenuLink: {
    defaultLabel: 'Configurable products',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
  submenuLinks: [
    {
      defaultLabel: 'Manage products',
      uriPath: 'bundles',
    },
    {
      defaultLabel: 'Manage schemas',
      uriPath: 'schemas',
    },
  ],
};

export default config;
