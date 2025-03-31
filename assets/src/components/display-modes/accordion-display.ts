import { BundleComponent, BundleVariant, ConfigurationState } from '../../interfaces/bundle.interfaces';
import '../component-selector';

class AccordionDisplay extends HTMLElement {
  private shadow: ShadowRoot;
  private bundleVariants: BundleVariant[] = [];
  private selections: ConfigurationState['selections'] = {};
  private locale: string = 'en-US';
  private mainProduct: any = null;
  private activeVariantIndex: number = 0;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  set data({ components, bundleVariants, selections, locale, mainProduct }: {
    components?: BundleComponent[];
    bundleVariants?: BundleVariant[];
    selections: ConfigurationState['selections'];
    locale?: string;
    mainProduct?: any;
  }) {
    // Support for both old components and new bundleVariants structure
    this.bundleVariants = bundleVariants || [];
    this.selections = selections;
    if (locale) this.locale = locale;
    if (mainProduct) this.mainProduct = mainProduct;
    this.render();
  }

  private render(): void {
    const styles = `
      .accordion-item {
        border: 1px solid var(--border-color);
        margin-bottom: 0.5rem;
        border-radius: 0.5rem;
      }

      .accordion-header {
        padding: 1rem;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .accordion-content {
        display: none;
        padding: 1rem;
      }

      .accordion-content.active {
        display: block;
        background-color: rgba(37, 99, 235, 0.05);
      }
      
      .variant-name {
        font-weight: bold;
      }
      
      .variant-description {
        font-size: 0.9rem;
        margin-top: 0.5rem;
        color: #666;
      }

      .accordion-indicator {
        position: relative;
        width: 20px;
        height: 20px;
      }

      .accordion-indicator::before,
      .accordion-indicator::after {
        content: '';
        position: absolute;
        background-color: var(--primary-color);
        transition: transform 0.3s ease;
      }

      .accordion-indicator::before {
        top: 9px;
        left: 0;
        width: 100%;
        height: 2px;
      }

      .accordion-indicator::after {
        top: 0;
        left: 9px;
        width: 2px;
        height: 100%;
      }

      .accordion-content.active + .accordion-header .accordion-indicator::after {
        transform: rotate(90deg);
      }

      .products-preview {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-top: 1rem;
      }

      .product-card {
        flex: 1 0 200px;
        max-width: 250px;
        padding: 1rem;
        border-radius: 0.5rem;
        background: white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }

      .product-image {
        width: 100%;
        height: 150px;
        overflow: hidden;
        border-radius: 0.5rem;
        margin-bottom: 0.5rem;
      }

      .product-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .product-name {
        font-size: 1rem;
        font-weight: 600;
        margin: 0.5rem 0;
      }

      .product-price {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--primary-color);
      }
    `;

    // Check if we have bundleVariants from the new structure
    if (this.bundleVariants && this.bundleVariants.length > 0) {
      this.shadow.innerHTML = `
        <style>${styles}</style>
        <div class="accordion">
          ${this.bundleVariants.map((variant, index) => `
            <div class="accordion-item" data-variant-index="${index}">
              <div class="accordion-header">
                <span class="variant-name">${variant.variantName?.[this.locale] || 'Option ' + (index + 1)}</span>
                <span class="accordion-indicator"></span>
              </div>
              <div class="accordion-content ${index === this.activeVariantIndex ? 'active' : ''}">
                ${variant.variantDescription?.[this.locale] ? 
                  `<div class="variant-description">${variant.variantDescription[this.locale]}</div>` : ''}
                <div class="products-preview">
                  ${variant.product.map(product => `
                    <div class="product-card">
                      <div class="product-image">
                        ${product.obj.masterVariant.images?.[0]?.url ? `
                          <img src="${product.obj.masterVariant.images[0].url}" 
                               alt="${product.obj.name[this.locale] || product.obj.name['en-US']}"
                               class="product-img">
                        ` : ''}
                      </div>
                      <h3 class="product-name">${product.obj.name[this.locale] || product.obj.name['en-US'] || ''}</h3>
                      <div class="product-price">
                        ${this.formatPrice(this.getVariantPrice(product.obj.masterVariant))}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      this.shadow.innerHTML = `
        <style>${styles}</style>
        <div class="accordion">
          <div class="accordion-item">
            <div class="accordion-header">
              <span>No bundle options available</span>
            </div>
          </div>
        </div>
      `;
    }

    this.attachListeners();
    // Select all products in the active accordion
    this.selectActiveAccordionProducts();
  }

  private attachListeners(): void {
    const headers = this.shadow.querySelectorAll('.accordion-header');
    headers.forEach(header => {
      header.addEventListener('click', (e) => {
        const accordionItem = (e.currentTarget as Element).closest('.accordion-item');
        if (!accordionItem) return;
        
        const variantIndex = parseInt(accordionItem.getAttribute('data-variant-index') || '0', 10);
        const content = accordionItem.querySelector('.accordion-content') as HTMLElement;
        
        if (!content) return;
        
        const isActive = content.classList.contains('active');
        
        // Close all accordions
        this.shadow.querySelectorAll('.accordion-content').forEach(item => {
          item.classList.remove('active');
        });

        if (!isActive) {
          // Open this accordion
          content.classList.add('active');
          this.activeVariantIndex = variantIndex;
          
          // Clear previous selections and select all products in this variant
          this.clearAllSelections();
          this.selectActiveAccordionProducts();
        }
      });
    });
  }

  private clearAllSelections(): void {
    // Clear the selections in the state
    Object.keys(this.selections).forEach(key => {
      delete this.selections[key];
      
      // Notify about removing this selection
      this.dispatchEvent(new CustomEvent('selection-change', {
        detail: {
          componentTitle: key,
          productId: this.selections[key]?.productId,
          checked: false
        }
      }));
    });
  }

  private selectActiveAccordionProducts(): void {
    if (!this.bundleVariants || this.bundleVariants.length === 0) return;
    
    const activeVariant = this.bundleVariants[this.activeVariantIndex];
    if (!activeVariant) return;

    const variantName = activeVariant.variantName[this.locale] || activeVariant.variantName['en-US'] || `Option ${this.activeVariantIndex + 1}`;
    
    // Add all products from this variant to selections
    activeVariant.product.forEach(product => {
      // Use the product ID as the key in selections
      this.dispatchEvent(new CustomEvent('selection-change', {
        detail: {
          componentTitle: variantName,
          productId: product.obj.id,
          checked: true
        }
      }));
    });
  }

  private formatPrice(price: { centAmount: number, fractionDigits: number, currencyCode: string } | undefined): string {
    if (!price) return '';
    
    const { centAmount, fractionDigits, currencyCode } = price;
    const amount = centAmount / Math.pow(10, fractionDigits);
    
    return new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency: currencyCode
    }).format(amount);
  }

  private getVariantPrice(variant: any): { centAmount: number, fractionDigits: number, currencyCode: string } | undefined {
    if (!variant) return undefined;
    
    // Try to get price from prices array first
    if (variant.prices && variant.prices.length > 0 && variant.prices[0].value) {
      return variant.prices[0].value;
    }
    
    // Fall back to price object if available
    if (variant.price && variant.price.value) {
      return variant.price.value;
    }
    
    return undefined;
  }
}

customElements.define('accordion-display', AccordionDisplay);

export default AccordionDisplay; 