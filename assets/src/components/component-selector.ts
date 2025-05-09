import { BundleComponent, ConfigurationState } from '../interfaces/bundle.interfaces';
import { formatPrice, getVariantPrice, truncateDescription } from '../utils/format.utils';

class ComponentSelector extends HTMLElement {
  private shadow: ShadowRoot;
  private component: BundleComponent | null = null;
  private selections: ConfigurationState['selections'] = {};
  private locale: string = 'en-US';

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  set data({ component, selections, locale }: { 
    component: BundleComponent; 
    selections: ConfigurationState['selections'];
    locale: string;
  }) {
    this.component = component;
    this.selections = selections;
    this.locale = locale;
    this.render();
  }

  private render(): void {
    if (!this.component) return;

    const displayMode = this.component.productRefDisplayMode || 'cards';
    const selectionMode = this.component.arrayDisplayMode || 'radio';

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
        ${this.component.productselectableProducts.map(product => `
          <div class="product-option">
            <input type="${selectionMode === 'radio' ? 'radio' : 'checkbox'}"
                   name="${this.component!.title}"
                   value="${product.id}"
                   ${this.selections[this.component!.title]?.productId === product.id ? 'checked' : ''}>
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
              ${this.component?.maxQuantity && this.component?.maxQuantity > 1 ? `
                <div class="quantity-selector">
                  <label>Quantity:</label>
                  <input type="number" 
                         min="${this.component?.mandatoryQuantity || 1}"
                         max="${this.component?.maxQuantity || 100}"
                         value="${this.selections[this.component!.title]?.quantity || this.component?.mandatoryQuantity || 1}">
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
        this.dispatchEvent(new CustomEvent('selection-change', {
          detail: {
            componentTitle: this.component!.title,
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
        this.dispatchEvent(new CustomEvent('quantity-change', {
          detail: {
            componentTitle: this.component!.title,
            quantity: parseInt(target.value, 10)
          }
        }));
      });
    });
  }
}

customElements.define('component-selector', ComponentSelector);

export default ComponentSelector;