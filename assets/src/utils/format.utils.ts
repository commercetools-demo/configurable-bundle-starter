export function truncateDescription(description: string): string {
  const plainText = description.replace(/<[^>]*>/g, '');
  return plainText.length > 150 ? 
    `${plainText.substring(0, 150)}...` : 
    plainText;
}

export function formatPrice(price: any): string {
  if (!price) return '';
  
  const amount = price.centAmount / Math.pow(10, price.fractionDigits);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currencyCode
  }).format(amount);
} 