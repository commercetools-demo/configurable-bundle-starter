import React from 'react';
import {
  CustomFormDetailPage,
  CustomFormModalPage,
} from '@commercetools-frontend/application-components';
import Constraints from '@commercetools-uikit/constraints';
import { useHistory } from 'react-router-dom';
import { CONTAINER, useSchema } from '../../hooks/use-schema';
import ContainerForm from '../organisms/schema-details/schema-details-form';
import type { Schema } from '../../hooks/use-schema/types';

type SchemaFormValues = Partial<Schema> & {
  key: string;
};

const CreateNewSchemaPage = () => {
  const { createScherma } = useSchema();
  const { goBack } = useHistory();

  const onSubmit = async (values: SchemaFormValues) => {
    await createScherma({
      name: values.name || '',
      ...(values.targetProductTypes && {
        targetProductTypes: values.targetProductTypes,
      }),
      attributes: values.attributes,
    } as Schema);
    goBack();
  };

  const onClose = () => {
    goBack();
  };

  return (
    <Constraints.Horizontal max="scale">
      <ContainerForm
        onSubmit={onSubmit}
        initialValues={
          {
            key: CONTAINER,
          } as SchemaFormValues
        }
      >
        {(formProps) => (
          <CustomFormModalPage
            title="Create new bundle schema"
            onClose={onClose}
            isOpen
            formControls={
              <>
                <CustomFormDetailPage.FormSecondaryButton
                  label="Cancel"
                  onClick={onClose}
                />
                <CustomFormDetailPage.FormPrimaryButton
                  isDisabled={formProps.isSubmitting}
                  onClick={() => formProps.submitForm()}
                  label="Create"
                />
              </>
            }
          >
            {formProps.formElements}
          </CustomFormModalPage>
        )}
      </ContainerForm>
    </Constraints.Horizontal>
  );
};

export default CreateNewSchemaPage;
