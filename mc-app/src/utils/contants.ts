export const referenceTypeToSingleValueMap: Record<string, string> = {
  'cart-discount': 'cartDiscount',
  'product-discount': 'productDiscount',
  'customer-group': 'customerGroup',
  'discount-code': 'discountCode',
  'key-value-document': 'customObject',
  'product-type': 'productType',
  'tax-category': 'taxCategory',
  'shopping-list': 'shoppingList',
  'shipping-method': 'shippingMethod',
  type: 'typeDefinition',
  'product-price': 'standalonePrice',
};

export const referenceTypeSkipKey: string[] = ['order'];

export enum TYPES_ENUM {
  String = 'String',
  LocalizedString = 'LocalizedString',
  Number = 'Number',
  Boolean = 'Boolean',
  Money = 'Money',
  Date = 'Date',
  Time = 'Time',
  DateTime = 'DateTime',
  Enum = 'Enum',
  LocalizedEnum = 'LocalizedEnum',
  Object = 'Object',
  Reference = 'Reference',
}
export enum REFERENCE_TYPES_ENUM {
  Cart = 'cart',
  CartDiscount = 'cart-discount',
  Category = 'category',
  Channel = 'channel',
  Customer = 'customer',
  CustomerGroup = 'customer-group',
  DiscountCode = 'discount-code',
  KeyValueDocument = 'key-value-document',
  Payment = 'payment',
  Product = 'product',
  ProductDiscount = 'product-discount',
  ProductPrice = 'product-price',
  ProductType = 'product-type',
  Order = 'order',
  OrderEdit = 'order-edit',
  ShippingMethod = 'shipping-method',
  ShoppingList = 'shopping-list',
  State = 'state',
  Store = 'store',
  TaxCategory = 'tax-category',
  Type = 'type',
  Zone = 'zone',
}

export const TYPES = {
  String: 'String',
  LocalizedString: 'LocalizedString',
  Number: 'Number',
  Boolean: 'Boolean',
  Money: 'Money',
  Date: 'Date',
  Time: 'Time',
  DateTime: 'DateTime',
  Enum: 'Enum',
  LocalizedEnum: 'LocalizedEnum',
  Object: 'Object',
  Reference: 'Reference',
};

export const ATTRIBUTE_DEFINITION_TO_TYPES = {
  text: 'String',
  ltext: 'LocalizedString',
  number: 'Number',
  boolean: 'Boolean',
  money: 'Money',
  date: 'Date',
  time: 'Time',
  datetime: 'DateTime',
  enum: 'Enum',
  lenum: 'LocalizedEnum',
  nested: 'Object',
  reference: 'Reference',
  set: '',
};

export enum CONFIGURATION_TYPES_ENUM {
  CUSTOM_OBJECT = 'custom-object',
  PRODUCT = 'product',
}

export const DEFAULT_DATALOCALE = 'en-US';
