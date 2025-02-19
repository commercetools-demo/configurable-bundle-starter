import PrimaryButton from '@commercetools-uikit/primary-button';
import {
  FormModalPage,
  useModalState,
} from '@commercetools-frontend/application-components';
import { FolderPlus } from 'lucide-react';
import { Form, Formik, useFormik } from 'formik';
import { useCloseModalConfirmation } from '../../../hooks/use-close-modal-confirmation';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { Product, ProductDraft } from '@commercetools/platform-sdk';
import CreateProductForm from '../../molecules/product-form/create-product-form';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { DEFAULT_DATALOCALE } from '../../../utils/contants';
import { useProductUpdater } from '../../../hooks/use-product-connector';
import { Link } from 'react-router-dom';
import { ExternalLinkIcon } from '@commercetools-uikit/icons';
import { BundleFormikValues } from '../../molecules/add-new-bundle-button';
import { convertAttributeMapToAttributes } from '../../../utils/attributes';
import { useState } from 'react';
import { SchemaResponse } from '../../../hooks/use-schema/types';
import { useProductTypeConnector } from '../../../hooks/use-product-type-connector';

type Formik = ReturnType<typeof useFormik>;
export type ProductFormikValues = {
  productDraft: ProductDraft;
};

interface Props {
  name: string;
  hideSuccessMessage?: boolean;
  schema?: SchemaResponse;
  handleChange?: Formik['handleChange'];
  setFieldValue: Formik['setFieldValue'];
  values?: BundleFormikValues;
  errors?: Formik['errors'];
}

const AddNewProductButton = ({
  schema,
  setFieldValue,
  name,
  hideSuccessMessage,
}: Props) => {
  const { isModalOpen, openModal, closeModal } = useModalState();
  const { ConfirmationModal, showConfirmationModal } =
    useCloseModalConfirmation();
  const showNotification = useShowNotification();
  const { dataLocale, project } = useApplicationContext();
  const { createProduct } = useProductUpdater();
  const { getProductTypeAttributeDefinitions } = useProductTypeConnector();
  const [createdProduct, setCreatedProduct] = useState<Product | null>();

  const hanldeCreateProduct = async (
    values: ProductFormikValues
  ): Promise<Product | undefined> => {
    const attributes = values?.productDraft?.masterVariant?.attributes || {};
    const productTypeAttributeDefinitions =
      await getProductTypeAttributeDefinitions(
        values?.productDraft?.productType?.id
      );
    const convertedAttributes = convertAttributeMapToAttributes(
      attributes,
      productTypeAttributeDefinitions
    );
    const productDraft: ProductDraft = {
      ...values?.productDraft,
      masterVariant: {
        ...values?.productDraft?.masterVariant,
        attributes: convertedAttributes,
      },
      publish: true,
    };
    const result = await createProduct(productDraft);
    return result;
  };

  const getExternalUrl = (id: string) => `/${project?.key}/products/${id}`;

  const handleSubmit = async (values: ProductFormikValues) => {
    const newProduct = await hanldeCreateProduct(values)
      .then((product?: Product) => {
        if (!product) {
          throw new Error('Failed to create Product');
        }
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.success,
          domain: DOMAINS.SIDE,
          text: 'Product created successfully',
        });
        closeModal();
        return product;
      })
      .catch((err) => {
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.error,
          domain: DOMAINS.SIDE,
          text: err.message || 'Failed to create Product',
        });
        return null;
      });
    setFieldValue(name, newProduct?.id);
    setCreatedProduct(newProduct);
  };

  return (
    <Formik<ProductFormikValues>
      initialValues={{
        productDraft: {
          name: {},
          slug: {},
          key: '',
          description: {},
          productType: {
            typeId: 'product-type',
          },
          masterVariant: {
            attributes: [],
            sku: '',
          },
        },
      }}
      onSubmit={handleSubmit}
    >
      {({
        values,
        isValid,
        errors,
        dirty,
        isSubmitting,
        resetForm,
        handleChange,
        submitForm,
        handleBlur,
        touched,
      }) => (
        <>
          {!hideSuccessMessage && createdProduct?.id && (
            <Spacings.Stack scale="m">
              <Text.Headline as="h2">
                Product created successfully!
              </Text.Headline>
              <Link to={getExternalUrl(createdProduct?.id)} target="_blank">
                <Spacings.Inline alignItems="center">
                  {`View product in a new tab:
                ${
                  createdProduct?.masterData?.current.name[
                    dataLocale || DEFAULT_DATALOCALE
                  ]
                }`}
                  <ExternalLinkIcon color="info" />
                </Spacings.Inline>
              </Link>
              <Text.Body>Please continue to the next step.</Text.Body>
            </Spacings.Stack>
          )}
          {!createdProduct?.id && (
            <>
              <PrimaryButton
                onClick={openModal}
                label="Start creating a product"
                iconLeft={<FolderPlus stroke="white" height={16} width={16} />}
              />
              <Form>
                <FormModalPage
                  isOpen={isModalOpen}
                  title="Create a product"
                  isPrimaryButtonDisabled={isSubmitting || !dirty || !isValid}
                  isSecondaryButtonDisabled={isSubmitting}
                  onPrimaryButtonClick={submitForm}
                  onSecondaryButtonClick={() =>
                    showConfirmationModal(dirty, closeModal)
                  }
                  onClose={closeModal}
                >
                  <CreateProductForm
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    touched={touched}
                    values={values}
                    errors={errors}
                    schema={schema}
                  />
                </FormModalPage>
              </Form>
              <ConfirmationModal
                onCloseConfirmation={() => {
                  resetForm();
                  closeModal();
                }}
              />
            </>
          )}
        </>
      )}
    </Formik>
  );
};

export default AddNewProductButton;
