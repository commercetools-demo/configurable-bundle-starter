import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { FEATURE_FLAGS_ENUM } from '../constants';
import { useMemo } from 'react';

interface FeatureFlags {
  productAttributeBundle: boolean;
  customObjectBundle: boolean;
}

export const useFeatureFlags = (): FeatureFlags => {
  const { environment } = useApplicationContext();
  const featureFlags = useMemo(() => {
    const featureFlagString = (environment as any).featureFlags;
    const featureFlags = featureFlagString?.split(',');
    return {
      productAttributeBundle: featureFlags.includes(
        FEATURE_FLAGS_ENUM.PRODUCT_ATTRIBUTE_BUNDLE
      ),
      customObjectBundle: featureFlags.includes(
        FEATURE_FLAGS_ENUM.CUSTOM_OBJECT_BUNDLE
      ),
    };
  }, [environment]);

  return featureFlags;
};
