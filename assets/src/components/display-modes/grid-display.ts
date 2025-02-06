import { BundleComponent, ConfigurationState } from '../../interfaces/bundle.interfaces';
import '../component-selector';

class GridDisplay extends HTMLElement {
  private shadow: ShadowRoot;
  private components: BundleComponent[] = [];
  private selections: ConfigurationState['selections'] = {};

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
      .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
      }

      .grid-item {
        border: 1px solid var(--border-color);
        padding: 1rem;
        border-radius: 0.5rem;
      }

      h3 {
        margin-top: 0;
        margin-bottom: 1rem;
      }
    `;

    this.shadow.innerHTML = `
      <style>${styles}</style>
      <div class="grid-container">
        ${this.components.map(component => `
          <div class="grid-item">
            <h3>${component.title}</h3>
            <component-selector></component-selector>
          </div>
        `).join('')}
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

    this.attachListeners();
  }

  private attachListeners(): void {
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

customElements.define('grid-display', GridDisplay);

export default GridDisplay; 