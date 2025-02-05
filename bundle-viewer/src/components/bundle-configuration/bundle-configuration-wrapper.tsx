import { useEffect, useState } from 'react';
import { useProduct } from '../../hooks/use-product';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Text from '@commercetools-uikit/text';
import ProductReferenceTree from './product-reference-tree';

type Props = {
  productId: string;
  variantId: string;
};

export const BundleConfigurationWrapper = ({ productId, variantId }: Props) => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>();
  const { getFullProductByIdAndVariantId } = useProduct();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await getFullProductByIdAndVariantId(
          productId,
          parseInt(variantId, 10)
        );
        setProduct(result);
      } catch (err) {
        setError('Failed to load product details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, variantId]);

  if (loading) {
    return (
      <ContentNotification type="info">
        <Text.Body>Loading...</Text.Body>
      </ContentNotification>
    );
  }

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{error}</Text.Body>
      </ContentNotification>
    );
  }

  if (!product) {
    return (
      <ContentNotification type="error">
        <Text.Body>No product found</Text.Body>
      </ContentNotification>
    );
  }

  return <ProductReferenceTree data={product} />;
};
