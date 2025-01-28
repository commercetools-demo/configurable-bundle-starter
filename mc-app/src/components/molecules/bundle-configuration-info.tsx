import React from 'react';
import { BundleFormikValues } from './add-new-bundle-button';
import { AttributeValue, SchemaResponse } from '../../hooks/use-schema/types';
import {
  getDisplayAttributes,
  getDisplayValues,
  isPlainObject,
} from '../../utils/form-utils';
import { FormattedDate } from 'react-intl';
import Text from '@commercetools-uikit/text';

interface Props {
  values: BundleFormikValues;
  schema?: SchemaResponse;
}

function renderValue(value: any) {
  if (isPlainObject(value)) {
    return <div>{renderObject(value)}</div>;
  }

  if (Array.isArray(value)) {
    return (
      <div>
        {value.map((val, index) => (
          <div data-testid="list-value" key={index}>
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
  const result = Object.entries(value).map(([key, value]) => {
    return (
      <div key={key}>
        <Text.Body data-testid="value-title" isBold as="span">
          {key}
        </Text.Body>
        &nbsp;
        {renderValue(value)}
      </div>
    );
  });

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
    <div>{renderObject(!value ? values?.bundleConfiguration : value)}</div>
  );
};

export default BundleConfigurationInfo;
