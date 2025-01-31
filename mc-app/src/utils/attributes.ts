import {
  Attribute,
  AttributeDefinition,
  AttributeType,
} from '@commercetools/platform-sdk';
import { ATTRIBUTE_DEFINITION_TO_TYPES } from './contants';

const getType = (type: AttributeType) => {
  if (type.name === 'set') {
    return ATTRIBUTE_DEFINITION_TO_TYPES[type.elementType.name];
  }
  return ATTRIBUTE_DEFINITION_TO_TYPES[type.name];
};

const getReferenceType = (type: AttributeType) => {
  if (type.name === 'set') {
    return {
      by: 'id',
      type: type.elementType.referenceTypeId,
    };
  }
};

export const convertAttributeDefinitionToAttribute = (
  attributeDefinition: AttributeDefinition
) => {
  return {
    ...attributeDefinition,
    type: getType(attributeDefinition.type),
    set: attributeDefinition.type.name === 'set',
    reference: getReferenceType(attributeDefinition.type),
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
