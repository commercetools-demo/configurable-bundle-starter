import { BundleComponent, ConfigurationState } from '../../interfaces/bundle.interfaces';
import { getVariantPrice, formatPrice } from '../../utils/format.utils';
import '../component-selector';

class WizardDisplay extends HTMLElement {
  private shadow: ShadowRoot;
  private components: BundleComponent[] = [];
  private currentStep = 0;
  private selections: ConfigurationState['selections'] = {};
  private locale: string = 'en-US';
  private mainProduct: any = null;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  set data({ components, currentStep, selections, locale, mainProduct }: {
    components: BundleComponent[];
    currentStep: number;
    selections: ConfigurationState['selections'];
    locale: string;
    mainProduct: any;
  }) {
    this.components = components;
    this.currentStep = currentStep;
    this.selections = selections;
    this.locale = locale;
    this.mainProduct = mainProduct;
    this.render();
  }


  private calculateSelectionsTotal(): number {
    return Object.entries(this.selections).reduce((total, [componentId, selection]) => {
      const component = this.components.find(c => c.title === componentId);
      if (!component) return total;
      
      const selectedProduct = component.productselectableProducts.find(p => p.id === selection.productId);
      if (!selectedProduct) return total;

      const price = getVariantPrice(selectedProduct.obj.masterVariant);
      return total + (price / 100 * (selection.quantity || 1));
    }, 0);
  }

  private render(): void {
    const styles = `
      .wizard {
        display: grid;
        grid-template-columns: 200px 1fr;
        gap: 2rem;
        padding: 1rem;
      }

      .component-tabs {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .component-tab {
        padding: 1rem;
        text-align: left;
        background: none;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        color: var(--text-color);
        font-size: 1rem;
      }

      .component-tab.active {
        background: var(--background-hover);
        font-weight: bold;
      }

      .wizard-content {
        border-left: 1px solid var(--border-color);
        padding-left: 2rem;
      }

      .wizard-footer {
        grid-column: 1 / -1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-color);
      }

      .total {
        font-size: 1.25rem;
        font-weight: bold;
      }

      .continue-button {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
      }

      .continue-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `;

    const isLastStep = this.currentStep === this.components.length - 1;
    const hasCurrentSelection = this.selections[this.components[this.currentStep]?.title];
    const showContinueButton = !isLastStep || (isLastStep && !hasCurrentSelection);

    const mainProductPrice = getVariantPrice(this.mainProduct?.masterVariant);
    const selectionsTotal = this.calculateSelectionsTotal();
    const currency = this.mainProduct?.masterVariant?.price?.value?.currencyCode || 
                    this.mainProduct?.masterVariant?.prices?.[0]?.value?.currencyCode ||
                    'USD';

    this.shadow.innerHTML = `
      <style>${styles}</style>
      <div class="wizard">
        <div class="component-tabs">
          ${this.components.map((component, index) => `
            <button class="component-tab ${index === this.currentStep ? 'active' : ''}"
                    data-step="${index}">
              ${component.title}
            </button>
          `).join('')}
        </div>
        <div class="wizard-content">
          <component-selector></component-selector>
        </div>
        <div class="wizard-footer">
          <div class="total">
            Total: ${formatPrice(mainProductPrice, this.locale, currency)} + ${formatPrice(selectionsTotal * 100, this.locale, currency)} = ${formatPrice((mainProductPrice + selectionsTotal * 100), this.locale, currency)}
          </div>
          ${showContinueButton ? `
            <button class="continue-button">
              Continue +${formatPrice(this.getSelectedComponentPrice() * 100, this.locale, currency)}
            </button>
          ` : ''}
        </div>
      </div>
    `;

    const componentSelector = this.shadow.querySelector('component-selector');
    if (componentSelector) {
      (componentSelector as any).data = {
        component: this.components[this.currentStep],
        selections: this.selections,
        locale: this.locale
      };
    }

    this.attachListeners();
  }

  private getSelectedComponentPrice(): number {
    const currentComponent = this.components[this.currentStep];
    const selection = this.selections[currentComponent.title];
    if (!selection) return 0;

    const selectedProduct = currentComponent.productselectableProducts.find(p => p.id === selection.productId);
    if (!selectedProduct) return 0;

    const price = getVariantPrice(selectedProduct.obj.masterVariant);
    return price / 100;
  }

  private attachListeners(): void {
    const tabs = this.shadow.querySelectorAll('.component-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const step = parseInt((e.currentTarget as HTMLElement).dataset.step || '0', 10);
        this.dispatchEvent(new CustomEvent('step-change', {
          detail: { step }
        }));
      });
    });

    const continueButton = this.shadow.querySelector('.continue-button');
    continueButton?.addEventListener('click', () => {
      if (this.currentStep < this.components.length - 1) {
        this.dispatchEvent(new CustomEvent('step-change', {
          detail: { step: this.currentStep + 1 }
        }));
      } else {
        this.dispatchEvent(new CustomEvent('configuration-complete'));
      }
    });

    const componentSelector = this.shadow.querySelector('component-selector');
    if (componentSelector) {
      componentSelector.addEventListener('selection-change', (e: any) => {
        const { componentTitle, productId, checked } = e.detail;
        // Update local state
        if (checked) {
          this.selections[componentTitle] = {
            productId,
            quantity: this.selections[componentTitle]?.quantity || 1
          };
        } else {
          delete this.selections[componentTitle];
        }
        
        // Dispatch event for parent components
        this.dispatchEvent(new CustomEvent('selection-change', { detail: e.detail }));
        
        // Re-render to update prices
        this.render();
      });

      componentSelector.addEventListener('quantity-change', (e: any) => {
        const { componentTitle, quantity } = e.detail;
        // Update local state
        if (this.selections[componentTitle]) {
          this.selections[componentTitle].quantity = quantity;
        }
        
        // Dispatch event for parent components
        this.dispatchEvent(new CustomEvent('quantity-change', { detail: e.detail }));
        
        // Re-render to update prices
        this.render();
      });
    }
  }
}

customElements.define('wizard-display', WizardDisplay);

export default WizardDisplay; 