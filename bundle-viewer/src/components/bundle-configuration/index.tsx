import { useCustomViewContext } from '@commercetools-frontend/application-shell-connectors';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Text from '@commercetools-uikit/text';
import { BundleConfigurationWrapper } from './bundle-configuration-wrapper';
export const BundleConfiguration = () => {
  const { hostUrl } = useCustomViewContext((context) => ({
    hostUrl: context.hostUrl,
  }));

  if (!hostUrl) {
    return (
      <ContentNotification type="error">
        <Text.Body>No host url</Text.Body>
      </ContentNotification>
    );
  }
  const [__, productId, variantId, tab] =
    hostUrl.match('/products/([^/]+)/variants/([^/]+)/?([^/]+)?') || [];

  if (!productId) {
    return (
      <ContentNotification type="error">
        <Text.Body>No product id</Text.Body>
      </ContentNotification>
    );
  }
  if (!variantId) {
    return (
      <ContentNotification type="error">
        <Text.Body>No variant id</Text.Body>
      </ContentNotification>
    );
  }
  return (
    <BundleConfigurationWrapper productId={productId} variantId={variantId} />
  );
};
