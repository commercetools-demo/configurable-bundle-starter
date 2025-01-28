import { IntlShape, MessageDescriptor } from 'react-intl';
import { addMethod, array, object, string, number, date, boolean } from 'yup';
import { AttributeValue, Reference } from '../hooks/use-schema/types';
import { TYPES, TYPES_ENUM } from './contants';
import LocalizedTextInput from '@commercetools-uikit/localized-text-input';

export const getValidation = (
  method: any,
  required: any,
  messages: any,
  intl: IntlShape
) => {
  let validation: any;
  switch (method) {
    case 'string':
      validation = string();
      break;
    case 'number':
      validation = number();
      break;
    case 'date':
      validation = date();
      break;
    case 'boolean':
      validation = boolean();
      break;
    default:
      validation = string();
      break;
  }

  //"<FormattedMessage {...messages.required} />
  return required
    ? validation.required(intl.formatMessage(messages.required))
    : validation.nullable();
};

export const getLocalizedStringValidation = (
  languages: Array<string>,
  required: boolean,
  messages: { [key: string]: MessageDescriptor }
) => {
  addMethod(object, 'atLeastOneOf', function (list) {
    return this.test({
      name: 'atLeastOneOf',
      message: messages.required as any, //<FormattedMessage {...messages.required} />,
      exclusive: true,
      test: (value) =>
        value == null || list.some((f: any) => value != null && !(f in value)),
    });
  });

  const localizedStringSchema = languages.reduce(
    (name, lang) => ({ ...name, [lang]: string() }),
    {}
  );
  const validation: any = object(localizedStringSchema);

  return required ? validation.atLeastOneOf(languages) : validation;
};

export const getValidationByType = (
  { type, required, attributes, reference }: any,
  languages: Array<string>,
  messages: { [key: string]: MessageDescriptor },
  intl: IntlShape
) => {
  switch (type) {
    case TYPES.String:
    case TYPES.Enum:
    case TYPES.LocalizedEnum:
    case TYPES.Time:
      return getValidation('string', required, messages, intl);

    case TYPES.LocalizedString:
      return getLocalizedStringValidation(languages, required, messages);

    case TYPES.Number:
      return getValidation('number', required, messages, intl);

    case TYPES.Boolean:
      return getValidation('boolean', required, messages, intl);

    case TYPES.Money:
      return object({
        amount: getValidation('string', required, messages, intl),
        currencyCode: string(),
      });

    case TYPES.Date:
    case TYPES.DateTime:
      return getValidation('date', required, messages, intl);

    case TYPES.Reference:
      return object({
        typeId: string(),
        [reference.by]: getValidation('string', required, messages, intl),
      });

    case TYPES.Object:
      return object(
        getAttributeValidation(attributes, languages, messages, intl)
      );

    default:
      return null;
  }
};

export const getValidationSpecification = (
  attribute: AttributeValue,
  languages: Array<string>,
  messages: { [key: string]: MessageDescriptor },
  intl: IntlShape
) => {
  const validation = getValidationByType(attribute, languages, messages, intl);
  return attribute.set ? array(validation) : validation;
};

export const getValueByType = (
  type: TYPES_ENUM,
  attributes: Array<AttributeValue> | undefined,
  reference: Reference | undefined,
  currencies: Array<string>,
  languages: Array<string>
) => {
  switch (type) {
    case TYPES.String:
    case TYPES.Number:
    case TYPES.Date:
    case TYPES.Time:
    case TYPES.DateTime:
    case TYPES.Enum:
    case TYPES.LocalizedEnum:
      return '';

    case TYPES.LocalizedString:
      return LocalizedTextInput.createLocalizedString(languages);

    case TYPES.Boolean:
      return false;

    case TYPES.Money:
      return {
        amount: '',
        currencyCode: currencies[0],
      };

    case TYPES.Reference:
      return (
        reference && {
          typeId: reference.type,
          [reference.by]: '',
        }
      );

    case TYPES.Object:
      return (
        attributes && getAttributeValues(attributes, currencies, languages)
      );

    default:
      return null;
  }
};

export const getInitialValueByType = (
  type: any,
  isSet: any,
  attributes: any,
  reference: any,
  currencies: Array<string>,
  languages: Array<string>
) =>
  isSet
    ? [getValueByType(type, attributes, reference, currencies, languages)]
    : getValueByType(type, attributes, reference, currencies, languages);
export const getAttributeValues = (
  attributes: Array<AttributeValue>,
  currencies: Array<string>,
  languages: Array<string>
): { [key: string]: unknown } => {
  return attributes.reduce(
    (value, { name, type, set, attributes: nested, reference }) => {
      return {
        ...value,
        [name]: getInitialValueByType(
          type,
          set,
          nested,
          reference,
          currencies,
          languages
        ),
      };
    },
    {}
  );
};

export const getAttributeValidation = (
  attributes: Array<AttributeValue>,
  languages: Array<string>,
  messages: { [key: string]: MessageDescriptor },
  intl: IntlShape
): { [key: string]: any } => {
  return attributes.reduce((result, attribute) => {
    return {
      ...result,
      [attribute.name]: getValidationSpecification(
        attribute,
        languages,
        messages,
        intl
      ),
    };
  }, {});
};

export const getDisplayAttributes = (
  attributes: Array<AttributeValue>
): Array<string> => {
  return attributes.reduce<Array<string>>((display, attribute) => {
    if (attribute.display) {
      return [...display, attribute.name];
    }
    if (attribute.attributes) {
      const nested = getDisplayAttributes(attribute.attributes);
      return [...display, ...nested];
    }
    return [...display];
  }, []);
};

export const isPlainObject = (value: any) => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  let prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

export const getDisplayValues = (value: any, attributes: Array<string>) => {
  return Object.entries(value).reduce((display, [itemKey, itemValue]) => {
    if (attributes.includes(itemKey)) {
      return { ...display, [itemKey]: itemValue };
    }

    if (isPlainObject(itemValue)) {
      const nested: any = getDisplayValues(
        { [itemKey]: itemValue },
        attributes
      );
      if (nested.length > 0) {
        return { ...display, [itemKey]: nested };
      }
    }

    return display;
  }, {});
};
