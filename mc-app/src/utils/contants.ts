import { AttributeValue } from '../hooks/use-schema/types';

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
  LocalizedMoney: 'LocalizedMoney',
  Date: 'Date',
  Time: 'Time',
  DateTime: 'DateTime',
  Enum: 'Enum',
  LocalizedEnum: 'LocalizedEnum',
  Object: 'Object',
  Nested: 'Nested',
  Reference: 'Reference',
};

export const ATTRIBUTE_DEFINITION_TO_TYPES = {
  text: 'String',
  ltext: 'LocalizedString',
  number: 'Number',
  boolean: 'Boolean',
  money: 'Money',
  lmoney: 'LocalizedMoney',
  date: 'Date',
  time: 'Time',
  datetime: 'DateTime',
  enum: 'Enum',
  lenum: 'LocalizedEnum',
  nested: 'Nested',
  reference: 'Reference',
  set: '',
};

export const TYPES_TO_ATTRIBUTE_DEFINITION = {
  String: 'text',
  LocalizedString: 'ltext',
  Number: 'number',
  Boolean: 'boolean',
  Money: 'money',
  LocalizedMoney: 'lmoney',
  Date: 'date',
  Time: 'time',
  DateTime: 'datetime',
  Enum: 'enum',
  LocalizedEnum: 'lenum',
  Nested: 'nested',
  Reference: 'reference',
  Set: 'set',
};

export enum CONFIGURATION_TYPES_ENUM {
  CUSTOM_OBJECT = 'custom-object',
  PRODUCT = 'product',
}

export const DEFAULT_DATALOCALE = 'en-US';

export const emptyAttribute: AttributeValue = {
  name: '',
  type: TYPES_ENUM.Boolean,
  set: false,
  required: false,
};

export const emptyProductType = {
  productType: {
    typeId: 'product-type',
    id: '',
  },
  attribute: '',
};

export const ATTRIBUTES = {
  Name: 'name',
  Type: 'type',
  Required: 'required',
  Set: 'set',
  Display: 'display',
  Attributes: 'attributes',
  Reference: 'reference',
  Enum: 'enum',
  LocalizedEnum: 'lenum',
  ArrayDisplayMode: 'arrayDisplayMode',
  ProductRefDisplayMode: 'productRefDisplayMode',
};

export const PRODUCT_REF_DISPLAY_MODES: Record<string, string> = {
  Cards: 'cards',
  List: 'list',
};

export const ARRAY_DISPLAY_MODE: Record<string, string> = {
  Dropdown: 'dropdown',
  Checkbox: 'checkbox',
  Radio: 'radio',
  All: 'all',
};

export const REFERENCE_BY = {
  Key: 'key',
  Id: 'id',
};

export const REFERENCE_TYPES = {
  // Cart: 'cart',
  // CartDiscount: 'cart-discount',
  Category: 'category',
  // Channel: 'channel',
  // Customer: 'customer',
  // CustomerGroup: 'customer-group',
  // DiscountCode: 'discount-code',
  // KeyValueDocument: 'key-value-document',
  // Payment: 'payment',
  Product: 'product',
  // ProductDiscount: 'product-discount',
  // ProductPrice: 'product-price',
  // ProductType: 'product-type',
  // Order: 'order',
  // OrderEdit: 'order-edit',
  // ShippingMethod: 'shipping-method',
  // ShoppingList: 'shopping-list',
  // State: 'state',
  // Store: 'store',
  // TaxCategory: 'tax-category',
  // Type: 'type',
  // Zone: 'zone',
};

export const BUNDLE_UI_CONFIGURATION_TYPES: Record<string, string> = {
  'Component  Selection': 'component-selection',
  'Preset Configs': 'preset-configs',
  'Base With Addons': 'base-with-addons',
  'Mix And Match': 'mix-and-match',
  'Tiered Selection': 'tiered-selection',
  'Package Deals': 'package-deals',
  'Subscription Bundle': 'subscription-bundle',
  'Dynamic Bundle': 'dynamic-bundle',
};

export const BUNDLE_UI_DISPLAY_MODES: Record<string, string> = {
  Wizard: 'wizard',
  Accordion: 'accordion',
  Tabs: 'tabs',
  Grid: 'grid',
  Sidebar: 'sidebar',
  Carousel: 'carousel',
  Comparison: 'comparison',
  Tree: 'tree',
  'Modal Sequence': 'modal-sequence',
  Matrix: 'matrix',
  Timeline: 'timeline',
  FloatingPanels: 'floating-panels',
  SplitView: 'split-view',
  Stepper: 'stepper',
};

export const ADD_TO_CART_CONFIGURATION_TYPES: Record<string, string> = {
  'Add all using parent link': 'add-with-parent-link',
  'Add as custom field': 'add-with-custom-fields',
};
