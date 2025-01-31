import {
  Attribute,
  AttributeDefinition,
  AttributeNestedType,
  AttributeReferenceType,
  AttributeSetType,
  AttributeType,
  ProductTypeReference,
} from '@commercetools/platform-sdk';
import { ATTRIBUTE_DEFINITION_TO_TYPES } from './contants';
import { AttributeValue } from '../hooks/use-schema/types';

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
      type: (type.elementType as AttributeReferenceType).referenceTypeId,
    };
  }
  return undefined;
};

async function resolveNestedAttributes(
  attributes: Array<AttributeDefinition>,
  fetchProductTypeAttributes: (id:string) => Promise<AttributeDefinition[] | undefined>,
  processedTypeIds: Set<string> = new Set(),
): Promise<Array<AttributeDefinition & {
  attributes?: Array<AttributeDefinition>;
}>> {
  const resolvedAttributes = await Promise.all(
    attributes.map(async (attr) => {
      // Clone the attribute to avoid modifying the original
      const resolvedAttr: AttributeDefinition & {
        attributes?: Array<AttributeDefinition>;
      } = { ...attr };

      // Check if this is a nested type
      if (attr.type.name === 'nested' && attr.type.typeReference || (attr.type.name === 'set' && attr.type.elementType?.name === 'nested')) {
        const typeRef = (attr.type as AttributeNestedType).typeReference ?? (attr.type as AttributeSetType).elementType?.typeReference;

        // Prevent infinite recursion by checking if we've already processed this type
        if (processedTypeIds.has(typeRef.id)) {
          console.warn(`Circular reference detected for type ${typeRef.id}`);
          return resolvedAttr;
        }

        try {
          // Add current type to processed set
          processedTypeIds.add(typeRef.id);

          // Fetch nested attributes
          const nestedAttributes = (await fetchProductTypeAttributes(typeRef.id)) || [];

          console.log('nestedAttributes', nestedAttributes);
          

          // Recursively resolve any nested attributes within the fetched attributes
          resolvedAttr.attributes = await resolveNestedAttributes(
            nestedAttributes,
            fetchProductTypeAttributes,
            processedTypeIds,
          );
        } catch (error) {
          console.error(
            `Failed to resolve nested attributes for type ${typeRef.id}:`,
            error
          );
          // Return the original attribute if we can't resolve the nested ones
          return resolvedAttr;
        }
      }

      return resolvedAttr;
    })
  );

  return resolvedAttributes;
}

export const convertAttributeDefinitionToAttribute = async (
  attributeDefinition: AttributeDefinition,
  fetchProductTypeAttributes: (id:string) => Promise<AttributeDefinition[] | undefined>
): Promise<AttributeValue> => {
  let attributeDef: AttributeDefinition & {
    attributes?: AttributeValue[];
  } = attributeDefinition;
  if (attributeDefinition.type.name === 'nested' || (attributeDefinition.type.name === 'set' && attributeDefinition.type.elementType?.name === 'nested')) {
    const attributes = await resolveNestedAttributes([attributeDefinition], fetchProductTypeAttributes);
    if (attributes.length > 0 && attributes?.[0].attributes?.length) {
      const subAttributes = await mapAttributeDefinitionsToAttributes(attributes[0].attributes, fetchProductTypeAttributes);
      attributeDef = {
        ...attributes[0],
        attributes: subAttributes,
      }
    }
  }
  return {
    ...attributeDef,
    type: getType(attributeDef.type),
    set: attributeDef.type.name === 'set',
    reference: getReferenceType(attributeDef.type),
  };
};

export const mapAttributeDefinitionsToAttributes = async (
  attributeDefinitions: Array<AttributeDefinition>,
  fetchProductTypeAttributes: (id:string) => Promise<AttributeDefinition[] | undefined>
) =>
  Promise.all(
    attributeDefinitions.map((attributeDefinition) =>
      convertAttributeDefinitionToAttribute(attributeDefinition, fetchProductTypeAttributes)
    )
  );

export const convertAttributeMapToAttributes = (
  attributeMap: Record<string, any>
): Attribute[] => {
  return Object.keys(attributeMap).map((key) => ({
    name: key,
    value: attributeMap[key],
  }));
};
