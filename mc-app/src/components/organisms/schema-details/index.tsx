import {
  CustomFormDetailPage,
  CustomFormModalPage,
} from '@commercetools-frontend/application-components';
import ContainerForm from './schema-details-form';
import { Schema, SchemaResponse } from '../../../hooks/use-schema/types';
import { CONTAINER, useSchema } from '../../../hooks/use-schema';
import { useHistory } from 'react-router-dom';

export type SchemaFormValues = Partial<Schema> & {
  key: string;
};

const SchemaDetails = ({ schema }: { schema: SchemaResponse }) => {
  const { updateSchema, deleteSchema } = useSchema();
  const { goBack } = useHistory();
  const onSubmit = async (values: SchemaFormValues) => {
    await updateSchema(schema.key, {
      name: values.name || '',
      ...(values.targetProductTypes && {
        targetProductTypes: values.targetProductTypes,
      }),
      attributes: values.attributes,
      bundleUISettings: values.bundleUISettings,
      addToCartConfiguration: values.addToCartConfiguration,
    } as Schema);
    goBack();
  };

  const onClose = () => {
    goBack();
  };

  const onDelete = async () => {
    await deleteSchema(schema.key);
    goBack();
  };

  return (
    <ContainerForm
      onSubmit={onSubmit}
      initialValues={{
        key: CONTAINER,
        ...schema.value,
      }}
    >
      {(formProps) => {
        return (
          <CustomFormModalPage
            title={'Bundle schema details'}
            onClose={onClose}
            isOpen
            formControls={
              <>
                <CustomFormDetailPage.FormSecondaryButton
                  label={'Cancel'}
                  isDisabled={!formProps.isDirty}
                  onClick={formProps.handleReset}
                />
                <CustomFormDetailPage.FormPrimaryButton
                  isDisabled={formProps.isSubmitting || !formProps.isDirty}
                  onClick={() => formProps.submitForm()}
                  label={'Save'}
                />
                <CustomFormModalPage.FormDeleteButton
                  onClick={() => onDelete()}
                />
              </>
            }
          >
            {formProps.formElements}
          </CustomFormModalPage>
        );
      }}
    </ContainerForm>
  );
};

export default SchemaDetails;
