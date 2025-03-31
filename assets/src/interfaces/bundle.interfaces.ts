export interface BundleProduct {
  id: string;
  version: number;
  name: Record<string, string>;
  resolvedBundle: {
    bundleConfiguration: {
      components_and_parts?: Array<BundleComponent>;
      bundleVariants?: Array<BundleVariant>;
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
export interface Variant {
  images?: Array<{ url: string }>;
  prices?: Array<{
    value: {
      centAmount: number;
      fractionDigits: number;
      currencyCode: string;
    }
  }>;
  price?: {
    value: {
      centAmount: number;
      fractionDigits: number;
      currencyCode: string;
    }
  }
}

export interface BundleComponent {
  title: string;
  productselectableProducts: Array<{
    typeId: string;
    id: string;
    obj: {
      masterVariant: Variant;
      variants: Array<Variant>;
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

export interface BundleVariant {
  product: Array<{
    typeId: string;
    id: string;
    obj: {
      id: string;
      version: number;
      name: Record<string, string>;
      description?: Record<string, string>;
      masterVariant: Variant;
      variants: Array<Variant>;
      // Other product properties could be added as needed
    };
  }>;
  variantName: Record<string, string>;
  variantDescription: Record<string, string>;
} 