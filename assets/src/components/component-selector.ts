import { BundleComponent, BundleVariant, ConfigurationState } from '../interfaces/bundle.interfaces';
import { formatPrice, getVariantPrice, truncateDescription } from '../utils/format.utils';

class ComponentSelector extends HTMLElement {
  private shadow: ShadowRoot;
  private component: BundleComponent | null = null;
  private variant: BundleVariant | null = null;
  private products: any[] = [];
  private selections: ConfigurationState['selections'] = {};
  private locale: string = 'en-US';

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  set data({ component, variant, products, selections, locale }: { 
    component?: BundleComponent; 
    variant?: BundleVariant;
    products?: any[];
    selections: ConfigurationState['selections'];
    locale?: string;
  }) {
    this.component = component || null;
    this.variant = variant || null;
    this.products = products || [];
    this.selections = selections;
    if (locale) this.locale = locale;
    this.render();
  }

  private render(): void {
    // Determine which data structure we're working with
    let displayProducts: any[] = [];
    let title = '';
    let displayMode = 'cards';
    let selectionMode = 'radio';
    let maxQuantity = 1;
    let mandatoryQuantity = 1;

    if (this.component) {
      // Using old component structure
      displayProducts = this.component.productselectableProducts;
      title = this.component.title;
      displayMode = this.component.productRefDisplayMode || 'cards';
      selectionMode = this.component.arrayDisplayMode || 'radio';
      maxQuantity = this.component.maxQuantity || 1;
      mandatoryQuantity = this.component.mandatoryQuantity || 1;
    } else if (this.variant && this.products.length > 0) {
      // Using new variant structure
      displayProducts = this.products.map(product => ({
        typeId: 'product',
        id: product.id,
        obj: product
      }));
      title = this.variant.variantName[this.locale] || this.variant.variantName['en-US'] || '';
      // Default display settings for variants
      displayMode = 'cards';
      selectionMode = 'radio';
      maxQuantity = 1;
      mandatoryQuantity = 1;
    } else {
      // No data available
      this.shadow.innerHTML = '<div>No product options available</div>';
      return;
    }

    const styles = `
      .component-selector {
        display: grid;
        gap: 1rem;
      }

      .component-selector.cards {
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
      }

      .product-option {
        border: 1px solid var(--border-color);
        padding: 1rem;
        border-radius: 0.5rem;
      }

      .product-image {
        width: 100%;
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
        font-size: 1.125rem;
        font-weight: 600;
        margin: 0;
      }

      .product-description {
        font-size: 0.875rem;
        color: var(--text-color);
        opacity: 0.8;
        margin: 0;
        display: block;
        white-space: nowrap;
        overflow-x: hidden;
        text-overflow: ellipsis;
      }

      .product-price {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--primary-color);
      }

      .quantity-selector {
        margin-top: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    `;

    this.shadow.innerHTML = `
      <style>${styles}</style>
      <div class="component-selector ${displayMode}">
        ${displayProducts.map(product => `
          <div class="product-option">
            <input type="${selectionMode === 'radio' ? 'radio' : 'checkbox'}"
                   name="${title}"
                   value="${product.id}"
                   ${this.selections[title]?.productId === product.id ? 'checked' : ''}>
            <div class="product-info">
              <div class="product-image">
                ${product.obj.masterVariant.images?.[0]?.url ? `
                  <img src="${product.obj.masterVariant.images[0].url}" 
                       alt="${product.obj.name[this.locale] || product.obj.name['en-US']}"
                       class="product-img">
                ` : ''}
              </div>
              <h3 class="product-name">${truncateDescription(product.obj.name[this.locale] || product.obj.name['en-US'] || '', 28)}</h3>
              <p class="product-description">
                ${truncateDescription(product.obj.description?.[this.locale] || product.obj.description?.['en-US'] || '')}
              </p>
              <div class="product-price">
                ${formatPrice(getVariantPrice(product.obj.masterVariant))}
              </div>
              ${maxQuantity > 1 ? `
                <div class="quantity-selector">
                  <label>Quantity:</label>
                  <input type="number" 
                         min="${mandatoryQuantity}"
                         max="${maxQuantity}"
                         value="${this.selections[title]?.quantity || mandatoryQuantity}">
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    this.attachListeners();
  }

  private attachListeners(): void {
    const inputs = this.shadow.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    inputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        const componentTitle = target.name;
        this.dispatchEvent(new CustomEvent('selection-change', {
          detail: {
            componentTitle,
            productId: target.value,
            checked: target.checked
          }
        }));
      });
    });

    const quantityInputs = this.shadow.querySelectorAll('input[type="number"]');
    quantityInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        // Get the name from the closest input[type=radio/checkbox]
        const radioInput = target.closest('.product-option')?.querySelector('input[type="radio"], input[type="checkbox"]');
        if (radioInput) {
          const componentTitle = (radioInput as HTMLInputElement).name;
          this.dispatchEvent(new CustomEvent('quantity-change', {
            detail: {
              componentTitle,
              quantity: parseInt(target.value, 10)
            }
          }));
        }
      });
    });
  }
}

customElements.define('component-selector', ComponentSelector);

export default ComponentSelector;