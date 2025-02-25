import React, { FC, HTMLAttributes } from 'react';
import get from 'lodash/get';
import map from 'lodash/map';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import DateInput from '@commercetools-uikit/date-input';
import TimeInput from '@commercetools-uikit/time-input';
import DateTimeInput from '@commercetools-uikit/date-time-input';
import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import MoneyInput from '@commercetools-uikit/money-input';
import NumberInput from '@commercetools-uikit/number-input';
import TextInput from '@commercetools-uikit/text-input';
import SelectInput from '@commercetools-uikit/select-input';
import { ErrorMessage } from '@commercetools-uikit/messages';
import Spacings from '@commercetools-uikit/spacings';
import ReferenceInput from '../reference-input';
import AttributeField from './attribute-field'; // eslint-disable-line import/no-cycle
import { TYPES } from '../../../utils/contants';
import Card from '@commercetools-uikit/card';
import { AttributeValue } from '../../../hooks/use-schema/types';
import AddNewProductButton from '../new-product/add-new-product-button';
import Constraints from '@commercetools-uikit/constraints';
import LocalizedMoneyInput from '@commercetools-uikit/localized-money-input';

type Props = {
  type: string;
  title: string;
  name: string;
  value?: any;
  touched?: any;
  errors?: any;
  onChange(...args: unknown[]): unknown;
  onBlur(...args: unknown[]): unknown;
  isRequired?: boolean;
  isSet?: boolean;
  isNestedSet?: boolean;
  attributes?: unknown[];
  reference?: {
    by?: string;
    type?: string;
  };
  options?: {
    value: string;
    label: string;
  }[];
};

const AttributeInput: FC<Props & HTMLAttributes<HTMLDivElement>> = ({
  type,
  title,
  name,
  value,
  touched,
  errors,
  onChange,
  onBlur,
  isRequired,
  isSet,
  isNestedSet,
  attributes,
  reference,
  options,
  style,
}) => {
  const { currencies, dataLocale, timeZone } = useApplicationContext(
    (context) => ({
      currencies: context.project?.currencies ?? [],
      dataLocale: context.dataLocale ?? '',
      timeZone: context.user?.timeZone ?? '',
    })
  );

  switch (type) {
    case TYPES.String:
      return (
        <Spacings.Stack scale="xs">
          <TextInput
            data-testid="field-type-string"
            name={name}
            value={value}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched && errors && (
            <ErrorMessage data-testid="field-error">{errors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.LocalizedString:
      return (
        <Spacings.Stack scale="xs">
          <LocalizedTextInput
            data-testid="field-type-i18n-string"
            selectedLanguage={dataLocale}
            name={name}
            value={value}
            hasError={!!(LocalizedTextInput.isTouched(touched) && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {LocalizedTextInput.isTouched(touched) && errors?.defaultMessage && (
            <ErrorMessage data-testid="field-error">
              {errors.defaultMessage}
            </ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.Number:
      return (
        <Spacings.Stack scale="xs">
          <NumberInput
            data-testid="field-type-number"
            name={name}
            value={value}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched && errors && (
            <ErrorMessage data-testid="field-error">{errors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.Boolean:
      return (
        <Spacings.Stack scale="xs">
          <CheckboxInput
            data-testid="field-type-boolean"
            name={name}
            isChecked={JSON.parse(value)}
            value={JSON.stringify(value)}
            hasError={!!(touched && errors)}
            onChange={onChange}
          >
            {title}
          </CheckboxInput>
          {touched && errors && (
            <ErrorMessage data-testid="field-error">{errors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.Money:
      return (
        <Spacings.Stack scale="xs">
          <MoneyInput
            data-testid="field-type-money"
            currencies={currencies}
            name={name}
            value={value}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched && errors && (
            <ErrorMessage data-testid="field-error">
              {get(errors, 'amount')}
            </ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.LocalizedMoney:
      return (
        <Spacings.Stack scale="xs">
          <LocalizedMoneyInput
            selectedCurrency={currencies?.[0]}
            data-testid="field-type-money"
            name={name}
            value={value}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched && errors && (
            <ErrorMessage data-testid="field-error">
              {get(errors, 'amount')}
            </ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.Date:
      return (
        <Spacings.Stack scale="xs">
          <DateInput
            data-testid="field-type-date"
            name={name}
            value={value}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched && errors && (
            <ErrorMessage data-testid="field-error">{errors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.Time:
      return (
        <Spacings.Stack scale="xs">
          <TimeInput
            data-testid="field-type-time"
            name={name}
            value={value}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched && errors && (
            <ErrorMessage data-testid="field-error">{errors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.DateTime:
      return (
        <Spacings.Stack scale="xs">
          <DateTimeInput
            data-testid="field-type-datetime"
            timeZone={timeZone}
            name={name}
            value={value}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched && errors && (
            <ErrorMessage data-testid="field-error">{errors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.Enum:
    case TYPES.LocalizedEnum: {
      return (
        <Spacings.Stack scale="xs">
          <SelectInput
            data-testid="field-type-enum"
            name={name}
            options={options}
            value={value}
            isClearable={!isRequired && !isSet}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched && errors && (
            <ErrorMessage data-testid="field-error">{errors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );
    }

    case TYPES.Reference: {
      const referenceBy: any = get(reference, 'by');
      // const refValue = get(value, referenceBy, "");
      const refTouched = get(touched, referenceBy);
      const refErrors = get(errors, referenceBy);
      const hasError = !!(refTouched && refErrors);
      return (
        <>
          <div style={style}>
            <ReferenceInput
              data-testid="field-type-reference"
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              hasError={hasError}
              reference={reference}
            />
            {hasError && (
              <ErrorMessage data-testid="field-error">{refErrors}</ErrorMessage>
            )}
          </div>
          {reference?.type === 'product' && !value.id && (
            <AddNewProductButton
              hideSuccessMessage
              name={name}
              setFieldValue={(name: string, value: any) => {
                onChange({
                  target: {
                    name,
                    value: {
                      id: value,
                      by: referenceBy,
                    },
                  },
                });
                return value;
              }}
            />
          )}
        </>
      );
    }

    case TYPES.Nested: {
      return (
        <div style={style}>
          {(attributes as AttributeValue[])?.map((attribute, index) => {
            return (
              <Card
                key={index}
                theme={isNestedSet ? 'light' : 'dark'}
                type="flat"
              >
                <AttributeField
                  key={index}
                  type={attribute.type}
                  reference={attribute.reference}
                  options={attribute.enum || attribute.lenum}
                  name={`${name}.${index}.value`}
                  attributes={attribute.attributes}
                  title={attribute.name}
                  isRequired={attribute.required}
                  isSet={attribute.set}
                  isNestedSet
                  value={get(value, `${index}.value`)}
                  touched={get(touched, `${index}.value`)}
                  errors={get(errors, `${index}.value`)}
                  onBlur={onBlur}
                  onChange={onChange}
                />
              </Card>
            );
          })}
        </div>
      );
    }

    case TYPES.Object:
      return (
        <Constraints.Horizontal max={16}>
          <Spacings.Stack scale="s">
            {map(attributes, (attribute: any, index) => {
              const attributeName = attribute.name;
              return (
                <AttributeField
                  data-testid={`field-type-object-${index}`}
                  key={index}
                  type={attribute.type}
                  name={`${name}.${attributeName}`}
                  title={attribute.name}
                  attributes={attribute.attributes}
                  reference={attribute.reference}
                  isRequired={attribute.required}
                  isSet={attribute.set}
                  isNestedSet={isNestedSet ? false : isSet}
                  options={attribute.enum || attribute.lenum}
                  value={get(value, attributeName)}
                  touched={get(touched, attributeName)}
                  errors={get(errors, attributeName)}
                  onBlur={onBlur}
                  onChange={onChange}
                />
              );
            })}
          </Spacings.Stack>
        </Constraints.Horizontal>
      );

    default:
      return null;
  }
};
AttributeInput.displayName = 'AttributeInput';

export default AttributeInput;
