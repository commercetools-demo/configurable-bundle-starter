import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import CollapsibleMotion from '@commercetools-uikit/collapsible-motion';
import SelectProductForm from '../../../molecules/select-product-form';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { BundleFormikValues } from '../../../molecules/add-new-bundle-button';
import { SchemaResponse } from '../../../../hooks/use-schema/types';
import AddNewProductButton from '../../new-product/add-new-product-button';
import Card from '@commercetools-uikit/card';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import RadioInput from '@commercetools-uikit/radio-input';
import { useFormik } from 'formik';
import Constraints from '@commercetools-uikit/constraints';
type Formik = ReturnType<typeof useFormik>;

interface Props {
  handleChange: Formik['handleChange'];
  setFieldValue: Formik['setFieldValue'];
  values: BundleFormikValues;
  errors: Formik['errors'];
  schema?: SchemaResponse;
}

const SelectProductStep = ({
  handleChange,
  setFieldValue,
  values,
  errors,
  schema,
}: Props) => {
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

  return (
    <Spacings.Stack scale="m">
      <Text.Headline as="h2">Select a product or Create one</Text.Headline>

      {/*  */}

      <RadioInput.Group
        direction="stack"
        directionProps={{
          scale: 'm',
        }}
        name="createProduct"
        onChange={(e) =>
          setFieldValue(
            'createProduct',
            typeof e.target.value === 'string'
              ? e.target.value === 'true'
              : e.target.value
          )
        }
        value={values.createProduct}
      >
        <RadioInput.Option value={false}>
          Select an exsisting product
        </RadioInput.Option>
        <CollapsiblePanel
          header={<></>}
          css={{ marginTop: '0', minHeight: '0', paddingLeft: '15px' }}
          hideExpansionControls
          isClosed={values.createProduct}
          id="12345"
          theme="light"
          tone="primary"
          condensed
        >
          <Constraints.Horizontal max={16}>
            <SelectProductForm
              handleChange={handleChange}
              values={values}
              errors={errors}
              schema={schema}
            />
          </Constraints.Horizontal>
        </CollapsiblePanel>

        <RadioInput.Option value={true}>
          Or create a new product
        </RadioInput.Option>
        <CollapsiblePanel
          header={<></>}
          css={{ marginTop: '0', minHeight: '0', paddingLeft: '15px' }}
          hideExpansionControls
          isClosed={!values.createProduct}
          id="12345"
          theme="light"
          condensed
          tone="primary"
        >
          <Spacings.Stack scale="m">
            <AddNewProductButton
              setFieldValue={setFieldValue}
              values={values}
              errors={errors}
              handleChange={handleChange}
            />
          </Spacings.Stack>
        </CollapsiblePanel>
      </RadioInput.Group>

      {/*  */}
    </Spacings.Stack>
  );
};

export default SelectProductStep;
