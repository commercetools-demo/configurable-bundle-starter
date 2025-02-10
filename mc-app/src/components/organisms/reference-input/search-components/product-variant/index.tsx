import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { FC, useEffect, useState } from 'react';
import { GenericSearchInputProps } from '../../search-input/types';
import { Product } from '../product/types';
import SelectInput from '@commercetools-uikit/select-input';
import Checkbox from '@commercetools-uikit/checkbox-input';
import FieldLabel from '@commercetools-uikit/field-label';
import Spacings from '@commercetools-uikit/spacings';
import Constraints from '@commercetools-uikit/constraints';
import { useQuery } from '@apollo/client';
import ProductVariantAll from './product-variant-all.graphql';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import styled from 'styled-components';

const Spacer = styled.div`
  width: 1px;
  background-color: var(--color-neutral-95);
`;

const ProductVariantSearchInput: FC<
  React.HTMLAttributes<HTMLDivElement> &
    GenericSearchInputProps<Product & { sku?: string }>
> = (props) => {
  const { dataLocale } = useApplicationContext((context) => context);
  const [isChecked, setIsChecked] = useState(
    typeof props.value?.sku === 'undefined'
  );
  const { data, loading, error } = useQuery<
    Record<string, any>,
    { locale: string; filters?: any }
  >(ProductVariantAll, {
    variables: {
      filters: {
        string: `id: "${props.value?.id}"`,
      },
      locale: dataLocale || '',
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
    skip: !props.value?.id || isChecked,
  });

  const handleChange = () => {
    if (!isChecked) {
      props.onChange({
        target: {
          name: `${props.name}.sku`,
          value: undefined,
        },
      });
    }
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    setIsChecked(typeof props.value?.sku === 'undefined');
  }, [props.value?.sku]);

  if (!props.value?.id) {
    return null;
  }

  return (
    <Constraints.Horizontal>
      <Spacings.Inline>
        <Spacer />
        <Spacings.Stack>
          <FieldLabel title="Use all variants?" />
          <Spacings.Inline alignItems="center">
            <Checkbox onChange={handleChange} isChecked={isChecked} />
            {!isChecked && (
              <SelectInput
                value={props.value?.sku}
                name={`${props.name}.sku`}
                options={data?.productProjectionSearch?.results?.[0]?.allVariants?.map(
                  (item: any) => ({
                    label: item.sku,
                    value: item.sku,
                  })
                )}
                onChange={props.onChange}
              />
            )}
          </Spacings.Inline>
        </Spacings.Stack>
      </Spacings.Inline>
    </Constraints.Horizontal>
  );
};
ProductVariantSearchInput.displayName = 'ProductVariantSearchInput';

export default ProductVariantSearchInput;
