import { FC } from 'react';
import startCase from 'lodash/startCase';
import FieldLabel from '@commercetools-uikit/field-label';

type Props = {
  type: string;
  title: string;
  isRequired?: boolean;
  reference?: {
    by?: string;
    type?: string;
  };
};

const AttributeLabel: FC<Props> = ({ title, isRequired }) => {
  return (
    <FieldLabel title={startCase(title)} hasRequiredIndicator={isRequired} />
  );
};
AttributeLabel.displayName = 'AttributeLabel';
export default AttributeLabel;
