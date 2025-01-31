import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import LocalizedtextField from '@commercetools-uikit/localized-text-field';
import TextField from '@commercetools-uikit/text-field';
import React, { useEffect, useState } from 'react';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import Card from '@commercetools-uikit/card';
import { ProductFormikValues } from '../../organisms/new-product/add-new-product-button';
import { DEFAULT_DATALOCALE } from '../../../utils/contants';
import { useProductTypeConnector } from '../../../hooks/use-product-type-connector';
import SelectField from '@commercetools-uikit/select-field';
import { useFormik } from 'formik';
import ProductAttributeForm from './attribute-form';
type Formik = ReturnType<typeof useFormik>;

interface Props {
  handleChange: Formik['handleChange'];
  handleBlur: Formik['handleBlur'];
  touched: Formik['touched'];
  values: ProductFormikValues;
  errors: Formik['errors'];
}
const CreateProductForm = ({
  handleChange,
  handleBlur,
  touched,
  values,
  errors,
}: Props) => {
  const { dataLocale } = useApplicationContext();
  const { getProductTypes } = useProductTypeConnector();
  const [productTypes, setProductTypes] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    getProductTypes().then((productTypes) => {
      setProductTypes(
        productTypes.map((productType) => ({
          label: productType.name,
          value: productType.id,
        }))
      );
    });
  }, []);
  return (
    <Spacings.Stack>
      <Card type="raised">
        <Text.Headline as="h2">General info</Text.Headline>
        <SelectField
          options={productTypes}
          title="Product Type"
          name="productDraft.productType.id"
          value={values.productDraft?.productType?.id}
          onChange={handleChange}
        />
        <LocalizedtextField
          selectedLanguage={dataLocale || DEFAULT_DATALOCALE}
          defaultExpandLanguages
          title="Name"
          name="productDraft.name"
          value={values.productDraft?.name || {}}
          isRequired={true}
          onChange={handleChange}
        />
        <LocalizedtextField
          selectedLanguage={dataLocale || DEFAULT_DATALOCALE}
          defaultExpandLanguages
          title="Slug"
          name="productDraft.slug"
          value={values.productDraft?.slug || {}}
          isRequired={true}
          onChange={handleChange}
        />
        <LocalizedtextField
          selectedLanguage={dataLocale || DEFAULT_DATALOCALE}
          title="Description"
          name="productDraft.description"
          value={values.productDraft?.description || {}}
          onChange={handleChange}
        />
        <TextField
          title="Key"
          name="productDraft.key"
          value={values.productDraft?.key || ''}
          onChange={handleChange}
        />
      </Card>
      <Card type="raised">
        <Text.Headline as="h2">Master variant</Text.Headline>
        <TextField
          title="Sku"
          name="productDraft.masterVariant.sku"
          value={values.productDraft?.masterVariant?.sku || ''}
          onChange={handleChange}
        />
        <Text.Headline as="h2">Attributes</Text.Headline>
        <ProductAttributeForm
          values={values}
          errors={errors}
          handleChange={handleChange}
          handleBlur={handleBlur}
          touched={touched}
        />
      </Card>
    </Spacings.Stack>
  );
};

export default CreateProductForm;
