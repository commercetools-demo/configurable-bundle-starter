// src/components/product-card.ts

interface ProductData {
    name: string;
    price: number;
    description: string;
  }
  
  class ProductCard extends HTMLElement {
    private shadow: ShadowRoot;
  
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: 'open' });
    }
  
    static get observedAttributes(): string[] {
      return ['sku'];
    }
  
    connectedCallback(): void {
      this.render();
      void this.fetchProductData();
    }
  
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        console.log('attributeChangedCallback', name, oldValue, newValue);
        
      if (oldValue !== newValue) {
        void this.fetchProductData();
      }
    }
  
    private getApiBaseUrl(): string | null {
      const scriptTag = document.querySelector('script[src*="product-card"]');
      if (!scriptTag) {
        console.warn('Product card script tag not found');
        return null;
      }
  
      const scriptUrl = new URL(scriptTag.getAttribute('src') || '');
      console.log('scriptUrl', scriptUrl);
      
      return `${scriptUrl.origin}/api`;
    }
  
    private async fetchProductData(): Promise<void> {
      const sku = this.getAttribute('sku');
      const baseURL = this.getApiBaseUrl();
      console.log('sku', sku, 'baseURL', baseURL);
      
      
      if (!sku || !baseURL) {
        console.error('Missing SKU or unable to determine API base URL');
        const errorElement = this.shadow.querySelector('.error');
        if (errorElement) {
          errorElement.setAttribute('style', 'display: block');
        }
        return;
      }
  
      try {
        const response = await fetch(`${baseURL}/products/${sku}`);
        if (!response.ok) throw new Error('Failed to fetch product data');
        
        const product: ProductData = await response.json();
        this.updateProductDisplay(product);
      } catch (error) {
        console.error('Error fetching product:', error);
        const errorElement = this.shadow.querySelector('.error');
        if (errorElement) {
          errorElement.setAttribute('style', 'display: block');
        }
      }
    }
  
    private async addToCart(): Promise<void> {
      const sku = this.getAttribute('sku');
      const baseURL = this.getApiBaseUrl();
      
      if (!baseURL) {
        console.error('Unable to determine API base URL');
        return;
      }
  
      try {
        const response = await fetch(`${baseURL}/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sku }),
        });
  
        if (!response.ok) throw new Error('Failed to add to cart');
        
        const button = this.shadow.querySelector('.add-to-cart');
        if (button instanceof HTMLElement) {
          button.textContent = 'Added to Cart!';
          setTimeout(() => {
            button.textContent = 'Add to Cart';
          }, 2000);
        }
  
      } catch (error) {
        console.error('Error adding to cart:', error);
        const button = this.shadow.querySelector('.add-to-cart');
        if (button instanceof HTMLElement) {
          button.textContent = 'Error - Try Again';
        }
      }
    }
  
    private updateProductDisplay(product: ProductData): void {
      const productInfo = this.shadow.querySelector('.product-info');
      if (productInfo) {
        productInfo.innerHTML = `
          <h2>${product.name}</h2>
          <p class="price">$${product.price}</p>
          <p class="description">${product.description}</p>
        `;
      }
    }
  
    private render(): void {
      const styles = `
        :host {
          display: block;
          font-family: system-ui, sans-serif;
          background: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
  
        .product-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
  
        .product-info {
          flex: 1;
        }
  
        h2 {
          margin: 0 0 8px;
          font-size: 1.25rem;
        }
  
        .price {
          font-size: 1.5rem;
          font-weight: bold;
          color: #2563eb;
          margin: 8px 0;
        }
  
        .description {
          color: #4b5563;
          line-height: 1.5;
        }
  
        .error {
          color: #dc2626;
          display: none;
          padding: 8px;
          background: #fee2e2;
          border-radius: 4px;
          margin-bottom: 8px;
        }
  
        .add-to-cart {
          background: #2563eb;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.2s;
        }
  
        .add-to-cart:hover {
          background: #1d4ed8;
        }
      `;
  
      this.shadow.innerHTML = `
        <style>${styles}</style>
        <div class="product-card">
          <div class="error">Error loading product information</div>
          <div class="product-info">
            Loading...
          </div>
          <button class="add-to-cart">Add to Cart</button>
        </div>
      `;
  
      const button = this.shadow.querySelector('.add-to-cart');
      if (button) {
        button.addEventListener('click', () => void this.addToCart());
      }
    }
  }
  
  customElements.define('product-card', ProductCard);
  
  export default ProductCard;