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
    view: ['view_products', 'view_types'],
    manage: ['manage_products', 'manage_key_value_documents'],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    defaultLabel: 'Bundles',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
  submenuLinks: [
    {
      defaultLabel: 'Bundles',
      uriPath: '/',
    },
    {
      defaultLabel: 'Schema Editor',
      uriPath: '/schemas',
    },
  ],
};

export default config;
