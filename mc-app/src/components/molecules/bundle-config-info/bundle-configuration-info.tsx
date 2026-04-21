import { useEffect, useState } from 'react';
import { BundleFormikValues } from '../add-new-bundle-button';
import {
  AttributeValue,
  SchemaResponse,
} from '../../../hooks/use-schema/types';
import {
  getDisplayAttributes,
  getDisplayValues,
  isPlainObject,
} from '../../../utils/form-utils';
import { FormattedDate } from 'react-intl';
import Text from '@commercetools-uikit/text';
import styled from 'styled-components';
import { useProductUpdater } from '../../../hooks/use-product-connector';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

const StyledDiv = styled.div`
  .iconInput {
    position: relative;
    width: var(--constraint-m);
  }

  .icon {
    position: absolute;
    top: 0.3em;
    right: 0.3em;
  }

  .value > .item {
    margin-bottom: var(--spacing-s);
  }

  .nested {
    margin-top: var(--spacing-s);
    border-left: 1px solid var(--color-neutral);
    padding-left: var(--spacing-m);
  }

  .nested .nested {
    margin-top: 0;
  }

  .listItem {
    background-color: var(--color-neutral-95);
    border-radius: var(--spacing-s);
    padding: var(--spacing-s);
    margin-bottom: var(--spacing-s);
  }

  .listItem:last-child {
    margin-bottom: 0;
  }

  .listItem > .nested {
    border-left: none;
    padding-left: 0;
    margin-top: 0;
  }
`;

interface Props {
  values: BundleFormikValues;
  schema?: SchemaResponse;
}

function isProductReference(
  value: unknown
): value is { id: string; typeId: 'product' } {
  return (
    isPlainObject(value as object) &&
    typeof (value as any).id === 'string' &&
    (value as any).typeId === 'product'
  );
}

function ProductReferenceDisplay({ id }: { id: string }) {
  const { getProductById } = useProductUpdater();
  const { dataLocale } = useApplicationContext((ctx) => ({
    dataLocale: ctx.dataLocale ?? 'en',
  }));
  const [name, setName] = useState<string>(id);

  useEffect(() => {
    getProductById(id)
      .then((product) => {
        const localized = product?.masterData?.current?.name;
        setName((localized && (localized[dataLocale] ?? localized['en'])) || id);
      })
      .catch(() => setName(id));
  }, [id, dataLocale]);

  return <span>{name}</span>;
}

function hasValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value !== '';
  if (Array.isArray(value)) return value.some(hasValue);
  if (isPlainObject(value as object)) {
    return Object.values(value as object).some(hasValue);
  }
  return true;
}

function renderValue(value: any) {
  if (isProductReference(value)) {
    return <ProductReferenceDisplay id={value.id} />;
  }

  if (isPlainObject(value)) {
    return <div className="nested">{renderObject(value)}</div>;
  }

  if (Array.isArray(value)) {
    const nonEmpty = value.filter(hasValue);
    return (
      <div className="nested">
        {nonEmpty.map((val, index) => (
          <div className="listItem" key={index}>
            {renderValue(val)}
          </div>
        ))}
      </div>
    );
  }

  const dateRegex = /\d{4}-\d{2}-\d{2}/;
  if (typeof value === 'string' && value.match(dateRegex)) {
    return value.indexOf('T') >= 0 ? (
      <FormattedDate
        value={value}
        year={'numeric'}
        month={'numeric'}
        day={'numeric'}
        hour={'numeric'}
        minute={'numeric'}
        hour12={true}
        timeZoneName={'short'}
      />
    ) : (
      <FormattedDate
        value={value}
        year={'numeric'}
        month={'numeric'}
        day={'numeric'}
      />
    );
  }

  return value.toString();
}

function renderObject(value: { [key: string]: unknown }) {
  const result = Object.entries(value)
    .filter(([, val]) => hasValue(val))
    .map(([key, val]) => (
      <div key={key} className="item">
        <Text.Body as="span" fontWeight="bold">
          {key}
        </Text.Body>
        &nbsp;
        {renderValue(val)}
      </div>
    ));

  return result;
}
const BundleConfigurationInfo = ({ values, schema }: Props) => {
  if (!schema) {
    return null;
  }
  const displayAttributes = getDisplayAttributes(
    schema.value?.attributes as Array<AttributeValue>
  );

  const value =
    !displayAttributes || !displayAttributes.length
      ? values?.bundleConfiguration
      : getDisplayValues(values?.bundleConfiguration || {}, displayAttributes);

  return (
    <StyledDiv className="value">
      {renderObject(!value ? values?.bundleConfiguration : value)}
    </StyledDiv>
  );
};

export default BundleConfigurationInfo;
