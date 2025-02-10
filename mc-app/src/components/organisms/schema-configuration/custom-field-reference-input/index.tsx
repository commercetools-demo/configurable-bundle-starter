import SelectField from '@commercetools-uikit/select-field';
import { FC } from 'react';
import { useFormik } from 'formik';
import { SchemaFormValues } from '../../schema-details';
import messages from '../../schema-details/messages';
import { FormattedMessage } from 'react-intl';
import { useQuery } from '@apollo/client';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import GetTypeById from './type-by-id.graphql';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

type Formik = ReturnType<typeof useFormik<SchemaFormValues>>;

type Props = {
  name: string;
  value?: string;
  selectedType?: {
    id: string;
    typeId: string;
  };
  handleBlur: Formik['handleBlur'];
  handleChange: Formik['handleChange'];
};
export const CustomFieldReferenceInput: FC<Props> = ({
  name,
  value,
  selectedType,
  handleBlur,
  handleChange,
}) => {
  const { dataLocale } = useApplicationContext((context) => context);

  const { data } = useQuery<
    Record<string, any>,
    { locale: string; id?: string }
  >(GetTypeById, {
    variables: {
      id: selectedType?.id,
      locale: dataLocale || '',
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
    skip: !selectedType?.id,
  });

  return (
    <SelectField
      title={<FormattedMessage {...messages.customFieldReferenceInputTitle} />}
      name={name}
      value={value}
      options={data?.typeDefinition?.fieldDefinitions?.map((item: any) => ({
        label: item.name,
        value: item.name,
      }))}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );
};
