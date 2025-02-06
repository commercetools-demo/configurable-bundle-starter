import { BundleComponent, ConfigurationState } from '../../interfaces/bundle.interfaces';
import '../component-selector';

class AccordionDisplay extends HTMLElement {
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
    `;

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
              <component-selector data="${JSON.stringify({ component, selections: this.selections })}"></component-selector>
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
          selections: this.selections
        };
      }
    });

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

customElements.define('accordion-display', AccordionDisplay);

export default AccordionDisplay; 