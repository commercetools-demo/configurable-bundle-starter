export interface BundleProduct {
  id: string;
  version: number;
  name: Record<string, string>;
  resolvedBundle: {
    bundleConfiguration: {
      components_and_parts: Array<BundleComponent>;
    };
  };
  bundleSchema: {
    bundleUISettings: {
      configurationType: string;
      displayMode: string;
      displayModeProperties?: {
        allowSkipSteps?: boolean;
      };
    };
  };
}

export interface BundleComponent {
  title: string;
  productselectableProducts: Array<{
    typeId: string;
    id: string;
    obj: {
      masterVariant: {
        images?: Array<{ url: string }>;
        prices?: Array<{
          value: {
            centAmount: number;
            fractionDigits: number;
            currencyCode: string;
          }
        }>;
      };
      name: Record<string, string>;
      description?: Record<string, string>;
    };
  }>;
  mandatoryQuantity: number;
  maxQuantity: number;
  productRefDisplayMode?: string;
  arrayDisplayMode?: string;
}

export interface ConfigurationState {
  currentStep: number;
  selections: Record<string, {
    productId: string;
    quantity: number;
  }>;
} 