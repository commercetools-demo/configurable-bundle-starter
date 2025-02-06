import {
  CustomFormDetailPage,
  CustomFormModalPage,
} from '@commercetools-frontend/application-components';
import ContainerForm from './schema-details-form';
import { Schema, SchemaResponse } from '../../../hooks/use-schema/types';
import { CONTAINER, useSchema } from '../../../hooks/use-schema';

export type SchemaFormValues = Partial<Schema> & {
  key: string;
};

const SchemaDetails = ({ schema }: { schema: SchemaResponse }) => {
  const { updateSchema } = useSchema();
  const onSubmit = async (values: SchemaFormValues) => {
    await updateSchema(schema.key, {
      name: values.name || '',
      ...(values.targetProductTypes && {
        targetProductTypes: values.targetProductTypes,
      }),
      attributes: values.attributes,
    } as Schema);
  };

  const onClose = () => {
    console.log('onClose');
  };

  const onDelete = () => {
    console.log('onDelete');
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
            title={'Schema Details'}
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
