import {
  Attribute,
  AttributeDefinition,
  AttributeEnumType,
  AttributeLocalizedEnumType,
  AttributeNestedType,
  AttributeReferenceType,
  AttributeSetType,
  AttributeType,
} from '@commercetools/platform-sdk';
import {
  ATTRIBUTE_DEFINITION_TO_TYPES,
  REFERENCE_TYPES_ENUM,
  TYPES_ENUM,
} from './contants';
import { AttributeValue } from '../hooks/use-schema/types';

const getEnumValues = (
  attribute: AttributeDefinition
): AttributeValue['enum'] => {
  if (attribute.type?.name === 'set') {
    return (
      (attribute.type as AttributeSetType)?.elementType as AttributeEnumType
    )?.values?.map((enumValue) => ({
      value: enumValue.key,
      label: enumValue.label,
    }));
  }
  return (
    (attribute.type as AttributeEnumType)?.values?.map((enumValue) => ({
      value: enumValue.key,
      label: enumValue.label,
    })) || undefined
  );
};

const getLEnumValues = (
  attribute: AttributeDefinition
): AttributeValue['lenum'] => {
  if (attribute.type?.name === 'set') {
    return (
      (attribute.type as AttributeSetType)
        ?.elementType as AttributeLocalizedEnumType
    )?.values?.map((enumValue) => ({
      value: enumValue.key,
      label: enumValue.label,
    }));
  }
  return (
    (attribute.type as AttributeLocalizedEnumType)?.values?.map(
      (enumValue) => ({
        value: enumValue.key,
        label: enumValue.label,
      })
    ) || undefined
  );
};

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
      type: (type.elementType as AttributeReferenceType)
        .referenceTypeId as REFERENCE_TYPES_ENUM,
    };
  }
  return undefined;
};

async function resolveNestedAttributes(
  attributes: Array<AttributeDefinition>,
  fetchProductTypeAttributes: (
    id: string
  ) => Promise<AttributeDefinition[] | undefined>,
  processedTypeIds: Set<string> = new Set()
): Promise<
  Array<
    AttributeDefinition & {
      attributes?: Array<AttributeDefinition>;
    }
  >
> {
  const resolvedAttributes = await Promise.all(
    attributes.map(async (attr) => {
      // Clone the attribute to avoid modifying the original
      const resolvedAttr: AttributeDefinition & {
        attributes?: Array<AttributeDefinition>;
      } = { ...attr };

      // Check if this is a nested type
      if (
        (attr.type.name === 'nested' && attr.type.typeReference) ||
        (attr.type.name === 'set' && attr.type.elementType?.name === 'nested')
      ) {
        const typeRef =
          (attr.type as AttributeNestedType).typeReference ??
          (attr.type as AttributeSetType).elementType?.typeReference;

        // Prevent infinite recursion by checking if we've already processed this type
        if (processedTypeIds.has(typeRef.id)) {
          console.warn(`Circular reference detected for type ${typeRef.id}`);
          return resolvedAttr;
        }

        try {
          // Add current type to processed set
          processedTypeIds.add(typeRef.id);

          // Fetch nested attributes
          const nestedAttributes =
            (await fetchProductTypeAttributes(typeRef.id)) || [];

          console.log('nestedAttributes', nestedAttributes);

          // Recursively resolve any nested attributes within the fetched attributes
          resolvedAttr.attributes = await resolveNestedAttributes(
            nestedAttributes,
            fetchProductTypeAttributes,
            processedTypeIds
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
  fetchProductTypeAttributes: (
    id: string
  ) => Promise<AttributeDefinition[] | undefined>
): Promise<AttributeValue> => {
  let attributeDef: AttributeDefinition & {
    attributes?: AttributeValue[];
  } = attributeDefinition;
  if (
    attributeDefinition.type.name === 'nested' ||
    (attributeDefinition.type.name === 'set' &&
      attributeDefinition.type.elementType?.name === 'nested')
  ) {
    const attributes = await resolveNestedAttributes(
      [attributeDefinition],
      fetchProductTypeAttributes
    );
    if (attributes.length > 0 && attributes?.[0].attributes?.length) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const subAttributes = await mapAttributeDefinitionsToAttributes(
        attributes[0].attributes,
        fetchProductTypeAttributes
      );
      attributeDef = {
        ...attributes[0],
        attributes: subAttributes,
      };
    }
  }
  return {
    ...attributeDef,
    type: getType(attributeDef.type) as TYPES_ENUM,
    set: attributeDef.type.name === 'set',
    reference: getReferenceType(attributeDef.type),
    enum: getEnumValues(attributeDef),
    lenum: getLEnumValues(attributeDef),
    required: attributeDef.isRequired,
  };
};

export const mapAttributeDefinitionsToAttributes = async (
  attributeDefinitions: Array<AttributeDefinition>,
  fetchProductTypeAttributes: (
    id: string
  ) => Promise<AttributeDefinition[] | undefined>
) =>
  Promise.all(
    attributeDefinitions.map((attributeDefinition) =>
      convertAttributeDefinitionToAttribute(
        attributeDefinition,
        fetchProductTypeAttributes
      )
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

export const filterEmptyAttribute = (attribute: Attribute): boolean => {
  if (!attribute.value) {
    return false;
  }
  if (attribute.value?.typeId && !attribute.value?.id) {
    return false;
  }
  if (Array.isArray(attribute.value) && attribute.value.some((item) => !item)) {
    return false;
  }
  if (
    Array.isArray(attribute.value) &&
    attribute.value.some((item) => item.typeId && !item.id)
  ) {
    return false;
  }
  return true;
};
