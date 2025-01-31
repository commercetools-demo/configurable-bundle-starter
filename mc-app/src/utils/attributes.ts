import { Attribute, AttributeDefinition } from '@commercetools/platform-sdk';
import { ATTRIBUTE_DEFINITION_TO_TYPES } from './contants';

export const convertAttributeDefinitionToAttribute = (
  attributeDefinition: AttributeDefinition
) => {
  return {
    ...attributeDefinition,
    type: ATTRIBUTE_DEFINITION_TO_TYPES[attributeDefinition.type.name],
  };
};
export const convertAttributeMapToAttributes = (
  attributeMap: Record<string, any>
): Attribute[] => {
  return Object.keys(attributeMap).map((key) => ({
    name: key,
    value: attributeMap[key],
  }));
};
