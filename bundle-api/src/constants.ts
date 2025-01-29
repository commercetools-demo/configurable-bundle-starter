export const SCHEMAS_CONTAINER = 'configurable-bundles_schemas';
export const BUNDLES_CONTAINER = 'configurable-bundles_items';

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