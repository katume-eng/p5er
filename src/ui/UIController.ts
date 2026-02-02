import { EffectPipeline } from '../core/EffectPipeline';

type InputSource = 'camera' | 'image' | 'video';

interface UICallbacks {
  onInputSourceChange: ((source: InputSource) => void) | null;
  onEffectChange: (() => void) | null;
}

/**
 * UIController - Manages user interface separately from rendering
 * Handles effect controls, reordering, and input source selection
 */
export class UIController {
  pipeline: EffectPipeline;
  selectedEffectIndex: number;
  inputSource: InputSource;
  callbacks: UICallbacks;

  constructor(pipeline: EffectPipeline) {
    this.pipeline = pipeline;
    this.selectedEffectIndex = -1;
    this.inputSource = 'camera'; // 'camera', 'image', 'video'
    this.callbacks = {
      onInputSourceChange: null,
      onEffectChange: null
    };
  }

  /**
   * Create UI elements in the specified container
   * @param containerId - ID of container element
   */
  createUI(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="ui-panel">
        <h2>p5er - Effect Pipeline</h2>
        
        <div class="input-controls">
          <h3>Input Source</h3>
          <button id="btn-camera" class="input-btn active">Camera</button>
          <button id="btn-image" class="input-btn">Image</button>
          <button id="btn-video" class="input-btn">Video</button>
        </div>

        <div class="effect-list">
          <h3>Effects Pipeline</h3>
          <div id="effects-container"></div>
        </div>

        <div class="effect-controls">
          <h3>Effect Parameters</h3>
          <div id="parameters-container">
            <p class="hint">Select an effect to adjust parameters</p>
          </div>
        </div>
      </div>
    `;

    this.setupEventListeners();
    this.updateEffectList();
  }

  /**
   * Set up event listeners for UI controls
   */
  setupEventListeners(): void {
    // Input source buttons
    const cameraBtn = document.getElementById('btn-camera');
    const imageBtn = document.getElementById('btn-image');
    const videoBtn = document.getElementById('btn-video');

    if (cameraBtn) {
      cameraBtn.addEventListener('click', () => this.setInputSource('camera'));
    }
    if (imageBtn) {
      imageBtn.addEventListener('click', () => this.setInputSource('image'));
    }
    if (videoBtn) {
      videoBtn.addEventListener('click', () => this.setInputSource('video'));
    }
  }

  /**
   * Update the effects list display
   */
  updateEffectList(): void {
    const container = document.getElementById('effects-container');
    if (!container) return;

    const effects = this.pipeline.getEffects();
    
    if (effects.length === 0) {
      container.innerHTML = '<p class="hint">No effects in pipeline</p>';
      return;
    }

    let html = '<ul class="effects-list">';
    effects.forEach((effect, index) => {
      const activeClass = index === this.selectedEffectIndex ? 'active' : '';
      const enabledIcon = effect.isEnabled() ? '✓' : '✗';
      
      html += `
        <li class="effect-item ${activeClass}" data-index="${index}">
          <span class="effect-name">${effect.name}</span>
          <div class="effect-controls">
            <button class="toggle-btn" data-index="${index}">${enabledIcon}</button>
            <button class="up-btn" data-index="${index}" ${index === 0 ? 'disabled' : ''}>↑</button>
            <button class="down-btn" data-index="${index}" ${index === effects.length - 1 ? 'disabled' : ''}>↓</button>
          </div>
        </li>
      `;
    });
    html += '</ul>';
    
    container.innerHTML = html;
    this.attachEffectListeners();
  }

  /**
   * Attach event listeners to effect list items
   */
  attachEffectListeners(): void {
    // Effect selection
    document.querySelectorAll('.effect-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!target.classList.contains('toggle-btn') &&
            !target.classList.contains('up-btn') &&
            !target.classList.contains('down-btn')) {
          const element = item as HTMLElement;
          this.selectEffect(parseInt(element.dataset.index || '-1'));
        }
      });
    });

    // Toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const element = btn as HTMLElement;
        this.toggleEffect(parseInt(element.dataset.index || '-1'));
      });
    });

    // Reorder buttons
    document.querySelectorAll('.up-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const element = btn as HTMLElement;
        const index = parseInt(element.dataset.index || '-1');
        if (index > 0) {
          this.pipeline.reorderEffect(index, index - 1);
          if (this.selectedEffectIndex === index) {
            this.selectedEffectIndex = index - 1;
          }
          this.updateEffectList();
          this.notifyEffectChange();
        }
      });
    });

    document.querySelectorAll('.down-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const element = btn as HTMLElement;
        const index = parseInt(element.dataset.index || '-1');
        const effects = this.pipeline.getEffects();
        if (index < effects.length - 1) {
          this.pipeline.reorderEffect(index, index + 1);
          if (this.selectedEffectIndex === index) {
            this.selectedEffectIndex = index + 1;
          }
          this.updateEffectList();
          this.notifyEffectChange();
        }
      });
    });
  }

  /**
   * Select an effect for parameter editing
   * @param index - Effect index
   */
  selectEffect(index: number): void {
    this.selectedEffectIndex = index;
    this.updateEffectList();
    this.updateParameterControls();
  }

  /**
   * Toggle effect enabled state
   * @param index - Effect index
   */
  toggleEffect(index: number): void {
    const effects = this.pipeline.getEffects();
    if (index >= 0 && index < effects.length) {
      const effect = effects[index];
      effect.setEnabled(!effect.isEnabled());
      this.updateEffectList();
      this.notifyEffectChange();
    }
  }

  /**
   * Update parameter controls for selected effect
   */
  updateParameterControls(): void {
    const container = document.getElementById('parameters-container');
    if (!container) return;

    const effects = this.pipeline.getEffects();
    if (this.selectedEffectIndex < 0 || this.selectedEffectIndex >= effects.length) {
      container.innerHTML = '<p class="hint">Select an effect to adjust parameters</p>';
      return;
    }

    const effect = effects[this.selectedEffectIndex];
    const params = effect.parameters;
    
    let html = `<h4>${effect.name} Parameters</h4>`;
    
    for (let key in params) {
      const value = params[key];
      
      if (typeof value === 'number') {
        html += `
          <div class="parameter">
            <label>${key}: <span id="value-${key}">${value.toFixed(2)}</span></label>
            <input type="range" 
                   id="param-${key}" 
                   min="0" 
                   max="1" 
                   step="0.01" 
                   value="${value}">
          </div>
        `;
      } else if (typeof value === 'boolean') {
        html += `
          <div class="parameter">
            <label>
              <input type="checkbox" 
                     id="param-${key}" 
                     ${value ? 'checked' : ''}>
              ${key}
            </label>
          </div>
        `;
      }
    }
    
    container.innerHTML = html;
    this.attachParameterListeners();
  }

  /**
   * Attach event listeners to parameter controls
   */
  attachParameterListeners(): void {
    const effects = this.pipeline.getEffects();
    if (this.selectedEffectIndex < 0 || this.selectedEffectIndex >= effects.length) {
      return;
    }

    const effect = effects[this.selectedEffectIndex];
    
    for (let key in effect.parameters) {
      const input = document.getElementById(`param-${key}`) as HTMLInputElement;
      if (!input) continue;

      if (input.type === 'range') {
        input.addEventListener('input', (e) => {
          const target = e.target as HTMLInputElement;
          const value = parseFloat(target.value);
          effect.setParameter(key, value);
          const valueSpan = document.getElementById(`value-${key}`);
          if (valueSpan) {
            valueSpan.textContent = value.toFixed(2);
          }
          this.notifyEffectChange();
        });
      } else if (input.type === 'checkbox') {
        input.addEventListener('change', (e) => {
          const target = e.target as HTMLInputElement;
          effect.setParameter(key, target.checked);
          this.notifyEffectChange();
        });
      }
    }
  }

  /**
   * Set input source
   * @param source - 'camera', 'image', or 'video'
   */
  setInputSource(source: InputSource): void {
    this.inputSource = source;
    
    // Update button states
    document.querySelectorAll('.input-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    const activeBtn = document.getElementById(`btn-${source}`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
    
    if (this.callbacks.onInputSourceChange) {
      this.callbacks.onInputSourceChange(source);
    }
  }

  /**
   * Get current input source
   * @returns Current input source
   */
  getInputSource(): InputSource {
    return this.inputSource;
  }

  /**
   * Set callback for input source changes
   * @param callback - Callback function
   */
  onInputSourceChange(callback: (source: InputSource) => void): void {
    this.callbacks.onInputSourceChange = callback;
  }

  /**
   * Set callback for effect changes
   * @param callback - Callback function
   */
  onEffectChange(callback: () => void): void {
    this.callbacks.onEffectChange = callback;
  }

  /**
   * Notify that effects have changed
   */
  notifyEffectChange(): void {
    if (this.callbacks.onEffectChange) {
      this.callbacks.onEffectChange();
    }
  }
}
