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
      applicationId: '${env:APPLICATION_ID}',
      url: '${env:APPLICATION_URL}',
    },
    development: {
      initialProjectKey: '${env:INITIAL_PROJECT_KEY}',
    },
  },
  oAuthScopes: {
    view: ['view_products'],
    manage: ['manage_products', 'manage_key_value_documents'],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    defaultLabel: 'Template starter',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
  submenuLinks: [
    {
      uriPath: 'channels',
      defaultLabel: 'Channels',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    },
  ],
};

export default config;
