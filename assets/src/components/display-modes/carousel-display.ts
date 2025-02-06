import { BundleComponent, ConfigurationState } from '../../interfaces/bundle.interfaces';
import '../component-selector';

class CarouselDisplay extends HTMLElement {
  private shadow: ShadowRoot;
  private components: BundleComponent[] = [];
  private selections: ConfigurationState['selections'] = {};
  private currentSlide = 0;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  set data({ components, selections }: {
    components: BundleComponent[];
    selections: ConfigurationState['selections'];
  }) {
    this.components = components;
    this.selections = selections;
    this.render();
  }

  private render(): void {
    const styles = `
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
        padding: 1rem;
      }

      .carousel-navigation {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
      }

      .carousel-prev,
      .carousel-next {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
      }

      .carousel-prev:disabled,
      .carousel-next:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `;

    this.shadow.innerHTML = `
      <style>${styles}</style>
      <div class="carousel">
        <div class="carousel-container">
          ${this.components.map(component => `
            <div class="carousel-item">
              <h3>${component.title}</h3>
              <component-selector data="${JSON.stringify({ component, selections: this.selections })}"></component-selector>
            </div>
          `).join('')}
        </div>
        <div class="carousel-navigation">
          <button class="carousel-prev" ${this.currentSlide === 0 ? 'disabled' : ''}>←</button>
          <button class="carousel-next" ${this.currentSlide === this.components.length - 1 ? 'disabled' : ''}>→</button>
        </div>
      </div>
    `;

    this.components.forEach((component, index) => {
      const componentSelector = this.shadow.querySelectorAll('component-selector')[index];
      if (componentSelector) {
        (componentSelector as any).data = {
          component,
          selections: this.selections
        };
      }
    });

    this.updateSlide();
    this.attachListeners();
  }

  private updateSlide(): void {
    const container = this.shadow.querySelector('.carousel-container');
    if (container) {
      container.setAttribute('style',
        `transform: translateX(-${this.currentSlide * 100}%)`
      );
    }
  }

  private attachListeners(): void {
    const prevButton = this.shadow.querySelector('.carousel-prev');
    const nextButton = this.shadow.querySelector('.carousel-next');

    prevButton?.addEventListener('click', () => {
      if (this.currentSlide > 0) {
        this.currentSlide--;
        this.updateSlide();
      }
    });

    nextButton?.addEventListener('click', () => {
      if (this.currentSlide < this.components.length - 1) {
        this.currentSlide++;
        this.updateSlide();
      }
    });

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

customElements.define('carousel-display', CarouselDisplay);

export default CarouselDisplay; 