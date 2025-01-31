import AsyncSelectField from '@commercetools-uikit/async-select-field';
import Card from '@commercetools-uikit/card';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import RadioInput from '@commercetools-uikit/radio-input';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useEffect, useState } from 'react';
import { useSchema } from '../../../../hooks/use-schema';
import { CONFIGURATION_TYPES_ENUM } from '../../../../utils/contants';
import { BundleFormikValues } from '../../../molecules/add-new-bundle-button';

interface Props {
  handleChange: (e: any) => void;
  values: BundleFormikValues;
  errors: any;
}
const SelectBundleTypeStep = ({ handleChange, values, errors }: Props) => {
  const [defaultOptions, setDefaultOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const { getSchemas } = useSchema();

  const loadOptions = () =>
    getSchemas().then((schemas) => {
      return schemas.map((schema) => ({
        label: schema.value?.name,
        value: schema.key,
      }));
    });

  useEffect(() => {
    loadOptions().then((options) => {
      setDefaultOptions(options as { label: string; value: string }[]);
    });
  }, []);

  return (
    <Spacings.Stack scale="m">
      <Text.Headline as="h2">Select Configuration</Text.Headline>

      <RadioInput.Group
        direction="stack"
        directionProps={{
          scale: 'm',
        }}
        name="configurationType"
        onChange={handleChange}
        value={values.configurationType ?? false}
      >
        <RadioInput.Option value={CONFIGURATION_TYPES_ENUM.PRODUCT}>
          Product with attributes
        </RadioInput.Option>
        <CollapsiblePanel
          header={<></>}
          css={{ marginTop: '0', minHeight: '0', paddingLeft: '15px' }}
          hideExpansionControls
          isClosed={
            values.configurationType !== CONFIGURATION_TYPES_ENUM.PRODUCT
          }
          id="12345"
          theme="light"
          tone="primary"
          condensed
        >
          Please continue to the next step
        </CollapsiblePanel>

        <RadioInput.Option value={CONFIGURATION_TYPES_ENUM.CUSTOM_OBJECT}>
          Custom object
        </RadioInput.Option>
        <CollapsiblePanel
          header={<></>}
          css={{ marginTop: '0', minHeight: '0', paddingLeft: '15px' }}
          hideExpansionControls
          isClosed={
            values.configurationType !== CONFIGURATION_TYPES_ENUM.CUSTOM_OBJECT
          }
          id="12345"
          theme="light"
          condensed
          tone="primary"
        >
          <Card
            isDisabled={
              values.configurationType !==
              CONFIGURATION_TYPES_ENUM.CUSTOM_OBJECT
            }
            type="raised"
          >
            <Text.Headline as="h2">Select Bundle Type</Text.Headline>
            <Spacings.Inline scale="m">
              <AsyncSelectField
                title="Bundle Type"
                name="bundleType"
                isDisabled={
                  values.configurationType !==
                  CONFIGURATION_TYPES_ENUM.CUSTOM_OBJECT
                }
                value={values.bundleType}
                onChange={handleChange}
                errors={errors.bundleType}
                touched={!!errors.bundleType}
                defaultOptions={defaultOptions}
                loadOptions={loadOptions}
              />
            </Spacings.Inline>
          </Card>
        </CollapsiblePanel>
      </RadioInput.Group>
    </Spacings.Stack>
  );
};

export default SelectBundleTypeStep;
