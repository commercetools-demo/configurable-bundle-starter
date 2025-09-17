import Card from '@commercetools-uikit/card';
import Constraints from '@commercetools-uikit/constraints';
import { BoxIcon, PlusBoldIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useFormik } from 'formik';
import { SchemaResponse } from '../../../../hooks/use-schema/types';
import { BundleFormikValues } from '../../../molecules/add-new-bundle-button';
import SelectProductForm from '../../../molecules/select-product-form';
import AddNewProductButton from '../../new-product/add-new-product-button';
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
  return (
    <Spacings.Stack scale="m">
      <Text.Headline as="h2">Select or create the main product</Text.Headline>
      <Spacings.Inline scale="m">
        <Card
          type="raised"
          css={{
            width: '500px',
            backgroundColor: !values.createProduct
              ? 'var(--color-neutral-85)'
              : 'white',
          }}
          onClick={() => setFieldValue('createProduct', false)}
        >
          <Spacings.Stack scale="m" alignItems="flex-start">
            <Spacings.Inline>
              <div style={{ width: '80px', height: '80px' }}>
                <BoxIcon size="scale" color="primary40" />
              </div>
              <Spacings.Stack>
                <Text.Headline as="h2">
                  Select an existing product
                </Text.Headline>
                <Text.Caption>
                  Select an existing product from the list of products to use as
                  the main bundle product.
                </Text.Caption>
              </Spacings.Stack>
            </Spacings.Inline>

            <Constraints.Horizontal max={16}>
              <SelectProductForm
                handleChange={handleChange}
                values={values}
                errors={errors}
                schema={schema}
              />
            </Constraints.Horizontal>
          </Spacings.Stack>
        </Card>
        <Card
          type="raised"
          css={{
            width: '500px',
            backgroundColor: values.createProduct
              ? 'var(--color-neutral-85)'
              : 'white',
          }}
          onClick={() => setFieldValue('createProduct', true)}
        >
          <Spacings.Stack scale="m" alignItems="flex-start">
            <Spacings.Inline>
              <div style={{ width: '80px', height: '80px' }}>
                <PlusBoldIcon size="scale" color="primary40" />
              </div>
              <Spacings.Stack>
                <Text.Headline as="h2">Create a new product</Text.Headline>
                <Text.Caption>
                  Create a new product from scratch and use it as the main
                  bundle product.
                </Text.Caption>
              </Spacings.Stack>
            </Spacings.Inline>

            <Constraints.Horizontal max={16}>
              <AddNewProductButton
                schema={schema}
                hideSuccessMessage
                showMinimalSuccessMessage
                name="mainProductReference.id"
                setFieldValue={setFieldValue}
                values={values}
                errors={errors}
                handleChange={handleChange}
              />
            </Constraints.Horizontal>
          </Spacings.Stack>
        </Card>
      </Spacings.Inline>
    </Spacings.Stack>
  );
};

export default SelectProductStep;
