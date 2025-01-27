import styled from 'styled-components';
import { Check, ChevronRight } from 'lucide-react';

const StepperContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const StepWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StepCircle = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid
    ${(props) => (props.isActive || props.isCompleted ? '#2563eb' : '#d1d5db')};
  background-color: ${(props) =>
    props.isCompleted ? '#2563eb' : 'transparent'};
  color: ${(props) =>
    props.isCompleted ? '#ffffff' : props.isActive ? 'black' : '#6b7280'};
`;

const StepTitle = styled.span<{ isActive: boolean }>`
  margin-left: 0.5rem;
  color: ${(props) => (props.isActive ? '#2563eb' : '#6b7280')};
`;

const Chevron = styled(ChevronRight)`
  margin: 0 1rem;
  color: #9ca3af;
`;

export const Stepper = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { title: 'Bundle type', number: 1 },
    { title: 'Main product', number: 2 },
    { title: 'Related products', number: 3 },
    { title: 'Review', number: 4 },
  ];

  return (
    <StepperContainer>
      {steps.map((step, index) => (
        <StepWrapper key={step.number}>
          <StepCircle
            isActive={currentStep >= step.number}
            isCompleted={currentStep > step.number}
          >
            {currentStep > step.number ? (
              <Check className="w-5 h-5" />
            ) : (
              step.number
            )}
          </StepCircle>
          <StepTitle isActive={currentStep >= step.number}>
            {step.title}
          </StepTitle>
          {index < steps.length - 1 && <Chevron />}
        </StepWrapper>
      ))}
    </StepperContainer>
  );
};
