import { BundleComponent, BundleProduct, BundleVariant, ConfigurationState } from '../../interfaces/bundle.interfaces';
import '../component-selector';
import { formatPrice, getBundleVariantPrice } from '../../utils/format.utils';

class AccordionDisplay extends HTMLElement {
  private shadow: ShadowRoot;
  private components: BundleComponent[] = [];
  private selections: ConfigurationState['selections'] = {};
  private locale: string = 'en-US';
  private bundleVariants: BundleVariant[] = [];
  private configurationType: string = '';

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  set data({ components, selections, locale, mainProduct }: {
    components: BundleComponent[];
    selections: ConfigurationState['selections'];
    locale: string;
    mainProduct: BundleProduct;
  }) {
    this.components = components;
    this.selections = selections;
    this.locale = locale || 'en-US';
    this.bundleVariants = mainProduct?.resolvedBundle?.bundleConfiguration?.bundleVariants || [];
    this.configurationType = mainProduct?.bundleSchema?.bundleUISettings?.configurationType || '';
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
      }

      .variant-price {
        font-weight: bold;
        color: var(--primary-color);
      }

      .variant-description {
        font-size: 0.9em;
        opacity: 0.8;
        margin-top: 0.5rem;
      }
    `;

    // For base-with-addons, we'll render bundle variants as accordion items
    if (this.configurationType === 'base-with-addons' && this.bundleVariants.length > 0) {
      this.shadow.innerHTML = `
        <style>${styles}</style>
        <div class="accordion">
          ${this.bundleVariants.map((variant, index) => `
            <div class="accordion-item">
              <div class="accordion-header">
                <span>${variant.variantName[this.locale] || variant.variantName['en-US'] || 'Option ' + (index + 1)}</span>
                ${variant.price ? `<span class="variant-price">${formatPrice(getBundleVariantPrice(variant.price), this.locale, variant.price.currencyCode)}</span>` : ''}
                <span class="accordion-indicator"></span>
              </div>
              <div class="accordion-content ${index === 0 ? 'active' : ''}">
                ${variant.variantDescription && (variant.variantDescription[this.locale] || variant.variantDescription['en-US']) ? 
                  `<div class="variant-description">${variant.variantDescription[this.locale] || variant.variantDescription['en-US']}</div>` : ''}
                <div class="variant-products">
                  <input type="radio" 
                         name="bundle-variant" 
                         value="${index}" 
                         data-variant-id="${index}"
                         ${index === 0 ? 'checked' : ''}>
                  <label>Select this package</label>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      // Original accordion for standard components
      this.shadow.innerHTML = `
        <style>${styles}</style>
        <div class="accordion">
          ${this.components.map((component, index) => `
            <div class="accordion-item">
              <div class="accordion-header">
                <span>${component.title}</span>
                <span class="accordion-indicator"></span>
              </div>
              <div class="accordion-content ${index === 0 ? 'active' : ''}">
                <component-selector></component-selector>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      this.components.forEach((component, index) => {
        const componentSelector = this.shadow.querySelectorAll('component-selector')[index];
        if (componentSelector) {
          (componentSelector as any).data = {
            component,
            selections: this.selections,
            locale: this.locale
          };
        }
      });
    }

    this.attachListeners();
  }

  private attachListeners(): void {
    const headers = this.shadow.querySelectorAll('.accordion-header');
    headers.forEach(header => {
      header.addEventListener('click', (e) => {
        const content = (e.currentTarget as Element)
          .nextElementSibling as HTMLElement;
        const isActive = content.classList.contains('active');

        this.shadow.querySelectorAll('.accordion-content').forEach(item => {
          item.classList.remove('active');
        });

        if (!isActive) {
          content.classList.add('active');
        }
      });
    });

    // For base-with-addons, handle variant selection
    if (this.configurationType === 'base-with-addons') {
      const variantRadios = this.shadow.querySelectorAll('input[type="radio"][name="bundle-variant"]');
      variantRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
          const target = e.target as HTMLInputElement;
          const variantIndex = parseInt(target.value, 10);
          const variant = this.bundleVariants[variantIndex];
          
          if (variant && variant.product) {
            // Clear existing selections
            this.selections = {};
            
            // Add all products from this variant to selections
            variant.product.forEach(product => {
              const productName = product.obj.name[this.locale] || product.obj.name['en-US'] || product.id;
              this.selections[productName] = {
                productId: product.id,
                quantity: 1
              };
            });
            
            // Dispatch event to update state
            this.dispatchEvent(new CustomEvent('selection-change', { 
              detail: { 
                bundleVariantIndex: variantIndex,
                selections: this.selections 
              } 
            }));
          }
        });
      });
    } else {
      // Original component selector listeners
      const componentSelectors = this.shadow.querySelectorAll('component-selector');
      componentSelectors.forEach(selector => {
        selector.addEventListener('selection-change', (e: any) => {
          this.dispatchEvent(new CustomEvent('selection-change', { detail: e.detail }));
        });

        selector.addEventListener('quantity-change', (e: any) => {
          this.dispatchEvent(new CustomEvent('quantity-change', { detail: e.detail }));
        });
      });
    }
  }
}

customElements.define('accordion-display', AccordionDisplay);

export default AccordionDisplay; 