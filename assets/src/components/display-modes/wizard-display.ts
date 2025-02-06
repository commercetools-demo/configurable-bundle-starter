import { BundleComponent, ConfigurationState } from '../../interfaces/bundle.interfaces';
import '../component-selector';

class WizardDisplay extends HTMLElement {
  private shadow: ShadowRoot;
  private components: BundleComponent[] = [];
  private currentStep = 0;
  private selections: ConfigurationState['selections'] = {};

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  set data({ components, currentStep, selections }: {
    components: BundleComponent[];
    currentStep: number;
    selections: ConfigurationState['selections'];
  }) {
    this.components = components;
    this.currentStep = currentStep;
    this.selections = selections;
    this.render();
  }

  private render(): void {
    const styles = `
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

      .wizard-navigation {
        display: flex;
        justify-content: space-between;
        margin-top: 2rem;
      }

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
    `;

    this.shadow.innerHTML = `
      <style>${styles}</style>
      <div class="wizard">
        <div class="wizard-steps">
          ${this.components.map((_, index) => `
            <div class="step-indicator ${index === this.currentStep ? 'active' : ''}">${index + 1}</div>
          `).join('')}
        </div>
        <div class="wizard-content">
          <component-selector></component-selector>
        </div>
        <div class="wizard-navigation">
          <button class="nav-button prev" ${this.currentStep === 0 ? 'disabled' : ''}>Previous</button>
          <button class="nav-button next" ${this.currentStep === this.components.length - 1 ? 'disabled' : ''}>
            ${this.currentStep === this.components.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    `;

    const componentSelector = this.shadow.querySelector('component-selector');
    if (componentSelector) {
      (componentSelector as any).data = {
        component: this.components[this.currentStep],
        selections: this.selections
      };
    }

    this.attachListeners();
  }

  private attachListeners(): void {
    const prevButton = this.shadow.querySelector('.prev');
    const nextButton = this.shadow.querySelector('.next');

    prevButton?.addEventListener('click', () => {
      if (this.currentStep > 0) {
        this.dispatchEvent(new CustomEvent('step-change', {
          detail: { step: this.currentStep - 1 }
        }));
      }
    });

    nextButton?.addEventListener('click', () => {
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
        this.dispatchEvent(new CustomEvent('selection-change', { detail: e.detail }));
      });

      componentSelector.addEventListener('quantity-change', (e: any) => {
        this.dispatchEvent(new CustomEvent('quantity-change', { detail: e.detail }));
      });
    }
  }
}

customElements.define('wizard-display', WizardDisplay);

export default WizardDisplay; 