import React, { useEffect, useState } from 'react';
import { Stepper } from './stepper';

import SelectBundleTypeStep from './steps/select-bundle-type-step';
import SelectProductStep from './steps/select-product-step';
import ReviewStep from './steps/review-step';
import styled from 'styled-components';
import { BundleFormikValues } from '../../molecules/add-new-bundle-button';
import BundleConfigurationStep from './steps/bundle-configuration-step';
import { useFormik } from 'formik';
import { SchemaResponse } from '../../../hooks/use-schema/types';
import { useSchema } from '../../../hooks/use-schema';
import { CONFIGURATION_TYPES_ENUM } from '../../../utils/contants';

type Formik = ReturnType<typeof useFormik>;

const StyledFormWrapper = styled.div`
  margin: 0 auto;
  padding: 6;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  padding: 0 1rem 2rem 1rem;
`;

const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

interface Props {
  values: BundleFormikValues;
  touched: Formik['touched'];
  errors: Formik['errors'];
  handleChange: Formik['handleChange'];
  handleBlur: Formik['handleBlur'];
  setFieldValue: any;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
}
const DrawerContent = ({
  handleBlur,
  handleChange,
  setFieldValue,
  touched,
  values,
  errors,
  currentStep,
  nextStep,
  prevStep,
}: Props) => {
  const [schema, setSchema] = useState<SchemaResponse | undefined>();
  const { getSchema } = useSchema();

  useEffect(() => {
    values.bundleType?.value &&
      getSchema(values.bundleType?.value).then((schema) => {
        setSchema(schema);
      });
  }, [values.bundleType, getSchema]);

  useEffect(() => {
    if (values?.configurationType === CONFIGURATION_TYPES_ENUM.PRODUCT) {
      setSchema(undefined);
    }
  }, [values.configurationType]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SelectBundleTypeStep
            nextStep={nextStep}
            setFieldValue={setFieldValue}
            values={values}
            handleChange={handleChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <SelectProductStep
            setFieldValue={setFieldValue}
            values={values}
            handleChange={handleChange}
            errors={errors}
            schema={schema}
          />
        );
      case 3:
        return (
          <BundleConfigurationStep
            values={values}
            handleChange={handleChange}
            handleBlur={handleBlur}
            touched={touched}
            errors={errors}
            schema={schema}
          />
        );
      case 4:
        return <ReviewStep values={values} schema={schema} />;
      default:
        return null;
    }
  };

  return (
    <StyledFormWrapper>
      <Stepper currentStep={currentStep} values={values} />

      <StepWrapper>{renderCurrentStep()}</StepWrapper>
    </StyledFormWrapper>
  );
};

export default DrawerContent;
