/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomView}
 */
const config = {
  name: 'Bundle Viewer',
  cloudIdentifier: '${env:CLOUD_IDENTIFIER}',
  env: {
    development: {
      initialProjectKey: '${env:INITIAL_PROJECT_KEY}',
      hostUriPath: '${env:HOST_URI_PATH}',
    },
    production: {
      customViewId: '${env:CUSTOM_VIEW_ID}',
    },
  },
  additionalEnv: {
    apiEndpoint: '${env:API_ENDPOINT}',
  },
  oAuthScopes: {
    view: ['view_products'],
    manage: ['manage_products'],
  },
  headers: {
    csp: {
      "script-src": ["${env:API_ENDPOINT}"],
      "connect-src": ["${env:API_ENDPOINT}"],

    }
  },
  type: 'CustomPanel',
  typeSettings: {
    size: 'SMALL',
  },
  locators: [
    'products.product_variant_details.general',
  ],
};

export default config;
