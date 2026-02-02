/**
 * Base Effect class for creating modular effects
 * Each effect processes an input buffer and writes to an output buffer
 */
class Effect {
  constructor(name, p5Instance) {
    this.name = name;
    this.p5 = p5Instance;
    this.enabled = true;
    this.parameters = {};
  }

  /**
   * Process the input buffer and write to output buffer
   * @param {p5.Graphics} inputBuffer - Source buffer to process
   * @param {p5.Graphics} outputBuffer - Destination buffer for result
   */
  process(inputBuffer, outputBuffer) {
    // Default behavior: pass through
    outputBuffer.image(inputBuffer, 0, 0);
  }

  /**
   * Set a parameter value
   * @param {string} key - Parameter name
   * @param {*} value - Parameter value
   */
  setParameter(key, value) {
    this.parameters[key] = value;
  }

  /**
   * Get a parameter value
   * @param {string} key - Parameter name
   * @returns {*} Parameter value
   */
  getParameter(key) {
    return this.parameters[key];
  }

  /**
   * Enable or disable this effect
   * @param {boolean} enabled - Whether effect is enabled
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * Check if effect is enabled
   * @returns {boolean} Whether effect is enabled
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Get effect metadata for UI
   * @returns {Object} Effect metadata
   */
  getMetadata() {
    return {
      name: this.name,
      enabled: this.enabled,
      parameters: this.parameters
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Effect;
}
