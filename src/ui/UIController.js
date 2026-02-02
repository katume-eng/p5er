/**
 * UIController - Manages user interface separately from rendering
 * Handles effect controls, reordering, and input source selection
 */
class UIController {
  constructor(pipeline) {
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
   * @param {string} containerId - ID of container element
   */
  createUI(containerId) {
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
  setupEventListeners() {
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
  updateEffectList() {
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
  attachEffectListeners() {
    // Effect selection
    document.querySelectorAll('.effect-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!e.target.classList.contains('toggle-btn') &&
            !e.target.classList.contains('up-btn') &&
            !e.target.classList.contains('down-btn')) {
          this.selectEffect(parseInt(item.dataset.index));
        }
      });
    });

    // Toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleEffect(parseInt(btn.dataset.index));
      });
    });

    // Reorder buttons
    document.querySelectorAll('.up-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
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
        const index = parseInt(btn.dataset.index);
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
   * @param {number} index - Effect index
   */
  selectEffect(index) {
    this.selectedEffectIndex = index;
    this.updateEffectList();
    this.updateParameterControls();
  }

  /**
   * Toggle effect enabled state
   * @param {number} index - Effect index
   */
  toggleEffect(index) {
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
  updateParameterControls() {
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
  attachParameterListeners() {
    const effects = this.pipeline.getEffects();
    if (this.selectedEffectIndex < 0 || this.selectedEffectIndex >= effects.length) {
      return;
    }

    const effect = effects[this.selectedEffectIndex];
    
    for (let key in effect.parameters) {
      const input = document.getElementById(`param-${key}`);
      if (!input) continue;

      if (input.type === 'range') {
        input.addEventListener('input', (e) => {
          const value = parseFloat(e.target.value);
          effect.setParameter(key, value);
          const valueSpan = document.getElementById(`value-${key}`);
          if (valueSpan) {
            valueSpan.textContent = value.toFixed(2);
          }
          this.notifyEffectChange();
        });
      } else if (input.type === 'checkbox') {
        input.addEventListener('change', (e) => {
          effect.setParameter(key, e.target.checked);
          this.notifyEffectChange();
        });
      }
    }
  }

  /**
   * Set input source
   * @param {string} source - 'camera', 'image', or 'video'
   */
  setInputSource(source) {
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
   * @returns {string} Current input source
   */
  getInputSource() {
    return this.inputSource;
  }

  /**
   * Set callback for input source changes
   * @param {Function} callback - Callback function
   */
  onInputSourceChange(callback) {
    this.callbacks.onInputSourceChange = callback;
  }

  /**
   * Set callback for effect changes
   * @param {Function} callback - Callback function
   */
  onEffectChange(callback) {
    this.callbacks.onEffectChange = callback;
  }

  /**
   * Notify that effects have changed
   */
  notifyEffectChange() {
    if (this.callbacks.onEffectChange) {
      this.callbacks.onEffectChange();
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIController;
}
