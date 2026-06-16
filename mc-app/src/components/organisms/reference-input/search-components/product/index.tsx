import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { FC } from 'react';
import AsyncSearchInput from '../../search-input/async-search-input';
import { GenericSearchInputProps, Result } from '../../search-input/types';
import { TEntity } from '../../types';
import ProductById from './product-by-id.graphql';
import ProductByKey from './product-by-key.graphql';
import ProductSearch from './product-search.graphql';
import ProductAll from './product-all.graphql';
import { Product, ProductProjectionItem } from './types';
import ProductVariantSearchInput from '../product-variant';
import Constraints from '@commercetools-uikit/constraints';
import Spacings from '@commercetools-uikit/spacings';
import { ExternalLinkIcon } from '@commercetools-uikit/icons';
import { Link } from 'react-router-dom';

const localizePathProductprojection = (product: ProductProjectionItem) => {
  return `${product.name}`;
};
const localizePath = (product: Product) => {
  return `${product.masterData?.current?.name}`;
};

const ProductSearchInput: FC<
  React.HTMLAttributes<HTMLDivElement> &
    GenericSearchInputProps<Product> & { externalUrl?: string }
> = (props) => {
  const { externalUrl } = props;
  const { dataLocale } = useApplicationContext((context) => context);
  const optionMapper = (data: Result<Product>) =>
    data.productProjectionSearch.results.map((product: Product): TEntity => {
      return {
        id: product.id,
        name: localizePathProductprojection(product),
        key: product.key,
      };
    });

  const variableBuilder = (text?: string) => ({
    ...(text && { text }),
    filters: props.where,
    locale: dataLocale,
  });
  const asyncInput = (
    <AsyncSearchInput<Product, Result<Product>>
      optionMapper={optionMapper}
      localizePath={localizePath}
      variableBuilder={variableBuilder}
      searchQuery={ProductSearch}
      byKeyQuery={ProductByKey}
      byIdQuery={ProductById}
      allQuery={ProductAll}
      {...props}
    />
  );

  if (props.renderText) {
    return asyncInput;
  }

  return (
    <Constraints.Horizontal>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 40 }}>
        <Spacings.Inline alignItems="center" scale="xs">
          <div style={{ width: 450, flexShrink: 0 }}>{asyncInput}</div>
          {!!externalUrl && !!props.value?.id && (
            <Link to={externalUrl} target="_blank">
              <ExternalLinkIcon color="info" />
            </Link>
          )}
        </Spacings.Inline>
        {/* Lift the variant control so its label lines up with the field's
            "Product" label, which sits one row above the input. */}
        <div style={{ marginTop: -26 }}>
          <ProductVariantSearchInput {...props} />
        </div>
      </div>
    </Constraints.Horizontal>
  );
};
ProductSearchInput.displayName = 'ProductSearchInput';

export default ProductSearchInput;
