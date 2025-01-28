import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import React from 'react';
import CollapsibleMotion from '@commercetools-uikit/collapsible-motion';
import CreateProductForm from '../../../molecules/create-product-form';
import SelectProductForm from '../../../molecules/select-product-form';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { BundleFormikValues } from '../../../molecules/add-new-bundle-button';
import { SchemaResponse } from '../../../../hooks/use-schema/types';

interface Props {
  handleChange: (e: any) => void;
  values: BundleFormikValues;
  errors: any;
  schema?: SchemaResponse;
}

const SelectProductStep = ({ handleChange, values, errors, schema }: Props) => {
  const handleToggleCreateProduct = () => {
    handleChange({
      target: { name: 'createProduct', value: !values.createProduct },
    });
    handleChange({
      target: { name: 'selectProduct', value: values.createProduct },
    });
  };
  const handleToggleSelctProduct = () => {
    handleChange({
      target: { name: 'selectProduct', value: !values.selectProduct },
    });
    handleChange({
      target: { name: 'createProduct', value: values.selectProduct },
    });
  };

  if (!schema) {
    return null;
  }

  return (
    <Spacings.Stack scale="m">
      <Text.Headline as="h2">Select a product or Create one</Text.Headline>

      <CollapsibleMotion
        isClosed={values.createProduct}
        onToggle={handleToggleSelctProduct}
      >
        {({ containerStyles, registerContentNode }) => (
          <Spacings.Stack scale="m">
            <Spacings.Inline>
              {values.selectProduct && (
                <Text.Headline as="h4">Select main product</Text.Headline>
              )}
              {values.createProduct && (
                <PrimaryButton
                  label="Or Select a product"
                  onClick={handleToggleSelctProduct}
                />
              )}
            </Spacings.Inline>

            <div style={containerStyles}>
              <div ref={registerContentNode}>
                <SelectProductForm
                  handleChange={handleChange}
                  values={values}
                  errors={errors}
                  schema={schema}
                />
              </div>
            </div>
          </Spacings.Stack>
        )}
      </CollapsibleMotion>
      <CollapsibleMotion
        isClosed={!values.createProduct}
        isDefaultClosed
        onToggle={handleToggleCreateProduct}
      >
        {({ containerStyles, registerContentNode }) => (
          <Spacings.Stack>
            <Spacings.Inline>
              {values.createProduct && (
                <Text.Headline as="h4">
                  Enter the main product info
                </Text.Headline>
              )}
              {values.selectProduct && (
                <PrimaryButton
                  label="Or Create a product"
                  isDisabled
                  onClick={handleToggleCreateProduct}
                />
              )}
            </Spacings.Inline>
            <div style={containerStyles}>
              <div ref={registerContentNode}>
                <CreateProductForm
                  handleChange={handleChange}
                  values={values}
                  errors={errors}
                />
              </div>
            </div>
          </Spacings.Stack>
        )}
      </CollapsibleMotion>
    </Spacings.Stack>
  );
};

export default SelectProductStep;
