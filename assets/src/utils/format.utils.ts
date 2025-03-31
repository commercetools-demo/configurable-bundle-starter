export const getVariantPrice = (variant: any): number => {
  if (!variant) return 0;
  
  // First try to get the single price property
  if (variant.price?.value?.centAmount) {
    return variant.price.value.centAmount;
  }
  
  // Fallback to prices array
  return variant.prices?.[0]?.value?.centAmount || 0;
};

export const getBundleVariantPrice = (price: { currencyCode: string, amount: string }): number => {
  if (!price || !price.amount) return 0;
  
  // Convert string amount (like "123.00") to cents (12300)
  const amountFloat = parseFloat(price.amount);
  return Math.round(amountFloat * 100);
};

export const formatPrice = (cents: number, locale: string = 'en-US', currency: string = 'USD'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(cents / 100);
};

export const truncateDescription = (description: string, maxLength: number = 100): string => {
  if (description.length <= maxLength) return description;
  return description.slice(0, maxLength) + '...';
};