import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import LocalizedtextField from '@commercetools-uikit/localized-text-field';
import TextField from '@commercetools-uikit/text-field';
import React from 'react';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import Card from '@commercetools-uikit/card';

interface Props {
  handleChange: (e: any) => void;
  values: any;
  errors: any;
}
const CreateProductForm = ({ handleChange, values, errors }: Props) => {
  const { dataLocale } = useApplicationContext();
  return (
    <Spacings.Stack>
      <Card type="raised">
        <Text.Headline as="h2">General info</Text.Headline>
        <LocalizedtextField
          selectedLanguage={dataLocale || 'en'}
          defaultExpandLanguages
          title="Name"
          name="mainProductCreation.name"
          value={values.mainProductCreation.name || ''}
          isRequired={true}
          onChange={handleChange}
          errors={errors.mainProductCreation?.name}
        />
        <LocalizedtextField
          selectedLanguage={dataLocale || 'en'}
          title="Description"
          name="mainProductCreation.description"
          value={values.mainProductCreation.description || ''}
          onChange={handleChange}
          errors={errors.mainProductCreation?.description}
        />
        <TextField
          title="Key"
          name="mainProductCreation.key"
          value={values.mainProductCreation.key || ''}
          onChange={handleChange}
          errors={errors.mainProductCreation?.key}
        />
      </Card>
      <Card type="raised">
        <Text.Headline as="h2">Variant</Text.Headline>
        <TextField
          title="SKU"
          name="mainProductCreation.masterVariant.sku"
          value={values.mainProductCreation.masterVariant?.sku || ''}
          onChange={handleChange}
          errors={errors.mainProductCreation?.masterVariant?.sku}
        />
      </Card>
    </Spacings.Stack>
  );
};

export default CreateProductForm;
