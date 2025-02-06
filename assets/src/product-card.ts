interface BundleProduct {
  id: string;
  version: number;
  name: Record<string, string>;
  resolvedBundle: {
    bundleConfiguration: {
      components_and_parts: Array<{
        title: string;
        productselectableProducts: Array<{
          typeId: string;
          id: string;
        }>;
        mandatoryQuantity: number;
        maxQuantity: number;
      }>;
    };
  };
  bundleSchema: {
    bundleUISettings: {
      configurationType: string;
      displayMode: string;
      displayModeProperties?: {
        allowSkipSteps?: boolean;
      };
    };
  };
}

interface ConfigurationState {
  currentStep: number;
  selections: Record<string, {
    productId: string;
    quantity: number;
  }>;
}

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

    switch (displayMode) {
      case 'wizard':
        this.renderWizard(container);
        break;
      case 'accordion':
        this.renderAccordion(container);
        break;
      case 'carousel':
        this.renderCarousel(container);
        break;
      default:
        this.renderGrid(container);
    }
  }

  private renderWizard(container: Element): void {
    const components = this.product!.resolvedBundle.bundleConfiguration.components_and_parts;
    // const { allowSkipSteps } = this.product!.bundleSchema.bundleUISettings.displayModeProperties || {};

    const wizardHtml = `
      <div class="wizard-steps">
        ${components.map((_, index) => `
          <div class="step-indicator ${index === this.state.currentStep ? 'active' : ''}">${index + 1}</div>
        `).join('')}
      </div>
      <div class="wizard-content">
        ${this.renderComponentSelector(components[this.state.currentStep])}
      </div>
      <div class="wizard-navigation">
        <button class="nav-button prev" ${this.state.currentStep === 0 ? 'disabled' : ''}>Previous</button>
        <button class="nav-button next" ${this.state.currentStep === components.length - 1 ? 'disabled' : ''}>
          ${this.state.currentStep === components.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    `;

    container.innerHTML = wizardHtml;
    this.attachWizardListeners(container);
  }

  private renderAccordion(container: Element): void {
    const components = this.product!.resolvedBundle.bundleConfiguration.components_and_parts;

    const accordionHtml = `
      <div class="accordion">
        ${components.map((component, index) => `
          <div class="accordion-item">
            <div class="accordion-header">
              <span>${component.title}</span>
              <span class="accordion-indicator"></span>
            </div>
            <div class="accordion-content ${index === 0 ? 'active' : ''}">
              ${this.renderComponentSelector(component)}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    container.innerHTML = accordionHtml;
    this.attachAccordionListeners(container);
  }

  private renderCarousel(container: Element): void {
    const components = this.product!.resolvedBundle.bundleConfiguration.components_and_parts;

    const carouselHtml = `
      <div class="carousel">
        <div class="carousel-container">
          ${components.map(component => `
            <div class="carousel-item">
              <h3>${component.title}</h3>
              ${this.renderComponentSelector(component)}
            </div>
          `).join('')}
        </div>
        <div class="carousel-navigation">
          <button class="carousel-prev">←</button>
          <button class="carousel-next">→</button>
        </div>
      </div>
    `;

    container.innerHTML = carouselHtml;
    this.attachCarouselListeners(container);
  }

  private renderGrid(container: Element): void {
    const components = this.product!.resolvedBundle.bundleConfiguration.components_and_parts;

    const gridHtml = `
      <div class="grid-container">
        ${components.map(component => `
          <div class="grid-item">
            <h3>${component.title}</h3>
            ${this.renderComponentSelector(component)}
          </div>
        `).join('')}
      </div>
    `;

    container.innerHTML = gridHtml;
  }

  private renderComponentSelector(component: any): string {
    const displayMode = component.productRefDisplayMode || 'cards';
    const selectionMode = component.arrayDisplayMode || 'radio';

    return `
      <div class="component-selector ${displayMode}">
        ${component.productselectableProducts.map((product: any) => `
          <div class="product-option">
            <input type="${selectionMode === 'radio' ? 'radio' : 'checkbox'}"
                   name="${component.title}"
                   value="${product.id}"
                   ${this.state.selections[component.title]?.productId === product.id ? 'checked' : ''}>
            <div class="product-info">
              <div class="product-image">
                ${product.obj.masterVariant.images?.[0]?.url ? `
                  <img src="${product.obj.masterVariant.images[0].url}" 
                       alt="${product.obj.name['en-US']}"
                       class="product-img">
                ` : ''}
              </div>
              <h3 class="product-name">${product.obj.name['en-US']}</h3>
              <p class="product-description">${this.truncateDescription(product.obj.description?.['en-US'] || '')}</p>
              <div class="product-price">
                ${this.formatPrice(product.obj.masterVariant.prices?.[0]?.value)}
              </div>
              ${component.maxQuantity > 1 ? `
                <div class="quantity-selector">
                  <label>Quantity:</label>
                  <input type="number" 
                         min="${component.mandatoryQuantity}"
                         max="${component.maxQuantity}"
                         value="${this.state.selections[component.title]?.quantity || component.mandatoryQuantity}">
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  private truncateDescription(description: string): string {
    // Remove HTML tags and truncate to 150 characters
    const plainText = description.replace(/<[^>]*>/g, '');
    return plainText.length > 150 ?
      `${plainText.substring(0, 150)}...` :
      plainText;
  }

  private formatPrice(price: any): string {
    if (!price) return '';

    const amount = price.centAmount / Math.pow(10, price.fractionDigits);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currencyCode
    }).format(amount);
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

      /* Wizard Styles */
      .wizard-steps {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .step-indicator {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background: var(--border-color);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      }

      .step-indicator.active {
        background: var(--primary-color);
        color: white;
      }

      /* Accordion Styles */
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

      /* Carousel Styles */
      .carousel {
        position: relative;
        overflow: hidden;
      }

      .carousel-container {
        display: flex;
        transition: transform 0.3s ease;
      }

      .carousel-item {
        flex: 0 0 100%;
      }

      /* Grid Styles */
      .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
      }

      /* Component Selector Styles */
      .component-selector {
        display: grid;
        gap: 1rem;
      }

      .component-selector.cards {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      }

      .product-option {
        border: 1px solid var(--border-color);
        padding: 1rem;
        border-radius: 0.5rem;
      }

      .quantity-selector {
        margin-top: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      /* Navigation Buttons */
      .nav-button {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
      }

      .nav-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .nav-button:hover:not(:disabled) {
        background: var(--secondary-color);
      }

      /* Product Card Styles */
.product-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-image {
  width: 100%;
  aspect-ratio: 1;
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
}

.product-price {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
}

/* Cards Display Mode */
.component-selector.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.component-selector.cards .product-option {
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.component-selector.cards .product-option:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

  private attachWizardListeners(container: Element): void {
    const prevButton = container.querySelector('.prev');
    const nextButton = container.querySelector('.next');

    prevButton?.addEventListener('click', () => {
      if (this.state.currentStep > 0) {
        this.state.currentStep--;
        this.renderConfigurator();
      }
    });

    nextButton?.addEventListener('click', () => {
      const components = this.product!.resolvedBundle.bundleConfiguration.components_and_parts;
      if (this.state.currentStep < components.length - 1) {
        this.state.currentStep++;
        this.renderConfigurator();
      }
    });
  }

  private attachAccordionListeners(container: Element): void {
    const headers = container.querySelectorAll('.accordion-header');
    headers.forEach(header => {
      header.addEventListener('click', (e) => {
        const content = (e.currentTarget as Element)
          .nextElementSibling as HTMLElement;
        const isActive = content.classList.contains('active');

        // Close all accordion items
        container.querySelectorAll('.accordion-content').forEach(item => {
          item.classList.remove('active');
        });

        // Toggle clicked item
        if (!isActive) {
          content.classList.add('active');
        }
      });
    });
  }

  private attachCarouselListeners(container: Element): void {
    const carouselContainer = container.querySelector('.carousel-container');
    const prevButton = container.querySelector('.carousel-prev');
    const nextButton = container.querySelector('.carousel-next');
    let currentSlide = 0;

    const updateSlide = () => {
      if (carouselContainer) {
        carouselContainer.setAttribute('style',
          `transform: translateX(-${currentSlide * 100}%)`
        );
      }
    };

    prevButton?.addEventListener('click', () => {
      if (currentSlide > 0) {
        currentSlide--;
        updateSlide();
      }
    });

    nextButton?.addEventListener('click', () => {
      const components = this.product!.resolvedBundle.bundleConfiguration.components_and_parts;
      if (currentSlide < components.length - 1) {
        currentSlide++;
        updateSlide();
      }
    });
  }
}

customElements.define('product-card', ProductCard);

export default ProductCard;