import AsyncSelectField from '@commercetools-uikit/async-select-field';
import Card from '@commercetools-uikit/card';
import FieldLabel from '@commercetools-uikit/field-label';
import { BinLinearIcon } from '@commercetools-uikit/icons';
import SecondaryIconButton from '@commercetools-uikit/secondary-icon-button';
import Spacings from '@commercetools-uikit/spacings';
import { AttributeDefinition } from '@commercetools/platform-sdk';
import { FC, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useProductTypeConnector } from '../../../hooks/use-product-type-connector';
import ReferenceInput from '../../organisms/reference-input';
import messages from '../../organisms/schema-details/messages';
import { Schema } from '../../../hooks/use-schema/types';

type TargetItemProps = {
  index: number;
  value: Schema['targetProductTypes'][0];
  handleChange: any;
  handleBlur: any;
  errors: any;
  onRemove: () => void;
};

const TargetItem: FC<TargetItemProps> = ({
  index,
  value,
  handleChange,
  handleBlur,
  errors,
  onRemove,
}) => {
  const intl = useIntl();
  const { getProductTypeAttributeDefinitions } = useProductTypeConnector();
  const [defaultOptions, setDefaultOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const onChange = (e: any) => {
    handleChange({
      target: {
        name: `targetProductTypes.${index}.attribute`,
        value: e.target.value.value,
      },
    });
  };

  const loadAttributeOptions = () =>
    getProductTypeAttributeDefinitions(value.productType.id).then(
      (attributes) =>
        attributes?.map((attr: AttributeDefinition) => ({
          label: attr.name,
          value: attr.name,
        })) || []
    );

  useEffect(() => {
    loadAttributeOptions().then((options) => {
      setDefaultOptions(options as { label: string; value: string }[]);
    });
  }, [value.productType?.id]);

  return (
    <Spacings.Inline alignItems="center">
      <Card type="flat">
        <FieldLabel
          title={<FormattedMessage {...messages.productTypeTitle} />}
          hasRequiredIndicator
        />
        <ReferenceInput
          name={`targetProductTypes.${index}.productType`}
          value={value.productType}
          onChange={handleChange}
          onBlur={handleBlur}
          reference={{
            by: 'id',
            type: 'product-type',
          }}
        />
        <AsyncSelectField
          name={`targetProductTypes.${index}.attribute`}
          title={<FormattedMessage {...messages.attributeTitle} />}
          value={{
            label: value.attribute,
            value: value.attribute,
          }}
          loadOptions={loadAttributeOptions}
          defaultOptions={defaultOptions}
          isRequired
          onBlur={handleBlur}
          onChange={onChange}
        />
      </Card>
      <SecondaryIconButton
        icon={<BinLinearIcon />}
        label={intl.formatMessage(messages.removeAttributeButton)}
        onClick={onRemove}
      />
    </Spacings.Inline>
  );
};

export default TargetItem;
