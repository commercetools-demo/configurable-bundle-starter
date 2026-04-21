import React, { ReactNode, Suspense, lazy } from 'react';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { referenceTypeToSingleValueMap } from '../../../../utils/contants';

const referenceTypeToComponentMap: Record<string, React.LazyExoticComponent<any>> = {
  category: lazy(() => import('../search-components/category')),
  customer: lazy(() => import('../search-components/customer')),
  product: lazy(() => import('../search-components/product')),
  cart: lazy(() => import('../search-components/cart')),
  order: lazy(() => import('../search-components/order')),
  'tax-category': lazy(() => import('../search-components/tax-category')),
  'cart-discount': lazy(() => import('../search-components/cart-discount')),
  'product-discount': lazy(() => import('../search-components/product-discount')),
  channel: lazy(() => import('../search-components/channel')),
  store: lazy(() => import('../search-components/store')),
  type: lazy(() => import('../search-components/type')),
  payment: lazy(() => import('../search-components/payment')),
  state: lazy(() => import('../search-components/state')),
  'product-price': lazy(() => import('../search-components/standalone-price')),
  'customer-group': lazy(() => import('../search-components/customer-group')),
  'discount-code': lazy(() => import('../search-components/discount-code')),
  'product-type': lazy(() => import('../search-components/product-type')),
  'shopping-list': lazy(() => import('../search-components/shopping-list')),
  'shipping-method': lazy(() => import('../search-components/shipping-method')),
  'key-value-document': lazy(() => import('../search-components/key-value-document')),
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

interface ReferenceTextProps {
  value: { id?: string; key?: string; typeId: string };
  referenceBy?: 'id' | 'key';
  loadingFallback?: ReactNode;
}

const ReferenceText: React.FC<ReferenceTextProps> = ({ value, referenceBy, loadingFallback }) => {
  const resolvedReferenceBy: 'id' | 'key' =
    referenceBy ?? (value.id ? 'id' : 'key');
  const referenceType = value.typeId;
  const singleValueQueryDataObject =
    referenceTypeToSingleValueMap[referenceType] ?? referenceType;
  const Component = referenceTypeToComponentMap[referenceType];

  if (!Component) {
    return <span>{referenceType}: {value.id ?? value.key}</span>;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={loadingFallback ?? <LoadingSpinner />}>
        <Component
          value={value}
          referenceBy={resolvedReferenceBy}
          referenceType={referenceType}
          singleValueQueryDataObject={singleValueQueryDataObject}
          renderText={true}
          loadingFallback={loadingFallback}
          name="reference-text"
          onChange={() => {}}
          onBlur={() => {}}
        />
      </Suspense>
    </ErrorBoundary>
  );
};

export default ReferenceText;
