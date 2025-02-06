import { BundleProduct, ConfigurationState } from './interfaces/bundle.interfaces';
import './components/display-modes/wizard-display';
import './components/display-modes/accordion-display';
import './components/display-modes/carousel-display';
import './components/display-modes/grid-display';

class ProductCard extends HTMLElement {
  private shadow: ShadowRoot;
  private product: BundleProduct | null = null;
  private state: ConfigurationState = {
    currentStep: 0,
    selections: {}
  };

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes(): string[] {
    return ['sku', 'baseurl'];
  }

  connectedCallback(): void {
    this.render();
    void this.fetchProductData();
  }

  attributeChangedCallback(_name: string, oldValue: string, newValue: string): void {
    if (oldValue !== newValue) {
      void this.fetchProductData();
    }
  }

  private getApiBaseUrl(): string | null {
    return this.getAttribute('baseurl');
  }

  private async fetchProductData(): Promise<void> {
    const sku = this.getAttribute('sku');
    const baseURL = this.getApiBaseUrl();

    if (!sku || !baseURL) {
      this.showError('Missing SKU or API base URL');
      return;
    }

    try {
      const response = await fetch(`${baseURL}/product-by-sku?sku=${sku}`);
      if (!response.ok) throw new Error('Failed to fetch product data');

      this.product = await response.json();
      this.renderConfigurator();
    } catch (error) {
      this.showError('Error loading product configuration');
    }
  }

  private showError(message: string): void {
    const errorElement = this.shadow.querySelector('.error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.setAttribute('style', 'display: block');
    }
  }

  private renderConfigurator(): void {
    if (!this.product) return;

    const { displayMode } = this.product.bundleSchema.bundleUISettings;
    const container = this.shadow.querySelector('.configurator-container');
    if (!container) return;

    container.innerHTML = '';

    const displayComponent = document.createElement(`${displayMode}-display`);
    (displayComponent as any).data = {
      components: this.product.resolvedBundle.bundleConfiguration.components_and_parts,
      currentStep: this.state.currentStep,
      selections: this.state.selections
    };

    this.attachDisplayListeners(displayComponent);
    container.appendChild(displayComponent);
  }

  private attachDisplayListeners(displayComponent: Element): void {
    displayComponent.addEventListener('selection-change', (e: any) => {
      const { componentTitle, productId, checked } = e.detail;
      if (checked) {
        this.state.selections[componentTitle] = {
          productId,
          quantity: this.state.selections[componentTitle]?.quantity || 1
        };
      } else {
        delete this.state.selections[componentTitle];
      }

      // TODO: we do not need rerendering
      // this.renderConfigurator();
    });

    displayComponent.addEventListener('quantity-change', (e: any) => {
      const { componentTitle, quantity } = e.detail;
      if (this.state.selections[componentTitle]) {
        this.state.selections[componentTitle].quantity = quantity;
      }
    });

    displayComponent.addEventListener('step-change', (e: any) => {
      this.state.currentStep = e.detail.step;
      this.renderConfigurator();
    });

    displayComponent.addEventListener('configuration-complete', () => {
      this.dispatchEvent(new CustomEvent('configuration-complete', {
        detail: {
          selections: this.state.selections
        }
      }));
    });
  }

  private render(): void {
    const styles = `
      :host {
        --primary-color: var(--configurator-primary-color, #2563eb);
        --secondary-color: var(--configurator-secondary-color, #1d4ed8);
        --background-color: var(--configurator-background-color, white);
        --text-color: var(--configurator-text-color, #1f2937);
        --border-color: var(--configurator-border-color, #e5e7eb);
        --error-color: var(--configurator-error-color, #dc2626);
        --success-color: var(--configurator-success-color, #059669);
        
        display: block;
        font-family: system-ui, sans-serif;
        color: var(--text-color);
        background: var(--background-color);
        padding: 1rem;
      }

      .error {
        color: var(--error-color);
        background: #fee2e2;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        display: none;
      }
    `;

    this.shadow.innerHTML = `
      <style>${styles}</style>
      <div class="bundle-configurator">
        <div class="error"></div>
        <div class="configurator-container">
          Loading...
        </div>
      </div>
    `;
  }
}

customElements.define('product-card', ProductCard);

export default ProductCard;