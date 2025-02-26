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
    return [
      'sku',
      'baseurl',
      'cartid',
      'locale',
      'pricecountry',
      'pricecurrency',
      'pricecustomergroup',
      'pricechannel',
      'storeprojection'
    ];
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

  private getCartId(): string | null {
    return this.getAttribute('cartid');
  }

  private getLocale(): string {
    return this.getAttribute('locale') || 'en-US';
  }

  private getPriceCountry(): string | null {
    return this.getAttribute('pricecountry');
  }

  private getPriceCurrency(): string | null {
    return this.getAttribute('pricecurrency');
  }

  private getPriceCustomerGroup(): string | null {
    return this.getAttribute('pricecustomergroup');
  }

  private getPriceChannel(): string | null {
    return this.getAttribute('pricechannel');
  }

  private getStoreProjection(): string | null {
    return this.getAttribute('storeprojection');
  }

  private async fetchProductData(): Promise<void> {
    const sku = this.getAttribute('sku');
    const baseURL = this.getApiBaseUrl();

    if (!sku || !baseURL) {
      this.showError('Missing SKU or API base URL');
      return;
    }

    try {
      const queryParams = new URLSearchParams({
        sku: sku
      });

      // Add optional price parameters if they exist
      const priceCountry = this.getPriceCountry();
      const priceCurrency = this.getPriceCurrency();
      const priceCustomerGroup = this.getPriceCustomerGroup();
      const priceChannel = this.getPriceChannel();
      const storeProjection = this.getStoreProjection();

      if (priceCountry) queryParams.append('priceCountry', priceCountry);
      if (priceCurrency) queryParams.append('priceCurrency', priceCurrency);
      if (priceCustomerGroup) queryParams.append('priceCustomerGroup', priceCustomerGroup);
      if (priceChannel) queryParams.append('priceChannel', priceChannel);
      if (storeProjection) queryParams.append('storeProjection', storeProjection);

      const response = await fetch(`${baseURL}/product-by-sku?${queryParams.toString()}`);
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
      selections: this.state.selections,
      locale: this.getLocale(),
      mainProduct: this.product
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
      
      // Update add to cart button state when selections change
      this.updateAddToCartButton();
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

  private async addToCart(): Promise<void> {
    const baseURL = this.getApiBaseUrl();
    const cartId = this.getCartId();
    
    if (!baseURL || !this.product || !cartId || Object.keys(this.state.selections).length === 0) {
      this.showError('Cannot add to cart: missing data, cart ID or selections');
      return;
    }

    try {
      const response = await fetch(`${baseURL}/add-to-cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: this.product.id,
          cartId,
          selections: this.state.selections
        })
      });
      const data = await response.json();


      if (!response.ok) {
        throw new Error(data.error || 'Failed to add to cart');
      }

      this.showSuccess('Successfully added to cart');
    } catch (error) {
      console.log('oh here', error);
      
      this.showError(error instanceof Error ? error.message : 'Failed to add to cart');
    }
  }

  private showSuccess(message: string): void {
    const successElement = this.shadow.querySelector('.success');
    if (successElement) {
      successElement.textContent = message;
      successElement.setAttribute('style', 'display: block');
      setTimeout(() => {
        successElement.setAttribute('style', 'display: none');
      }, 3000);
    }
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

      .error, .success {
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        display: none;
      }

      .error {
        color: var(--error-color);
        background: #fee2e2;
      }

      .success {
        color: var(--success-color);
        background: #ecfdf5;
      }

      .cart-button-container {
        margin-top: 2rem;
        display: flex;
        justify-content: center;
      }

      .add-to-cart-button {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        font-size: 1.125rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .add-to-cart-button:hover {
        background: var(--secondary-color);
      }

      .add-to-cart-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `;

    this.shadow.innerHTML = `
      <style>${styles}</style>
      <div class="bundle-configurator">
        <div class="error"></div>
        <div class="success"></div>
        <div class="configurator-container">
          Loading...
        </div>
        <div class="cart-button-container">
          <button class="add-to-cart-button" disabled>
            Add to Cart
          </button>
        </div>
      </div>
    `;

    const button = this.shadow.querySelector('.add-to-cart-button');
    if (button) {
      button.addEventListener('click', () => this.addToCart());
    }

    // Enable/disable add to cart button based on selections
    this.updateAddToCartButton();
  }

  private updateAddToCartButton(): void {
    const button = this.shadow.querySelector('.add-to-cart-button');
    if (button) {
      const hasSelections = Object.keys(this.state.selections).length > 0;
      button.toggleAttribute('disabled', !hasSelections);
    }
  }
}

customElements.define('product-card', ProductCard);

export default ProductCard;