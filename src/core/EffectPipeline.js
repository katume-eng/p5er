/**
 * EffectPipeline manages a reorderable chain of effects
 * Each effect processes an input buffer into an output buffer
 */
class EffectPipeline {
  constructor(p5Instance, width, height) {
    this.p5 = p5Instance;
    this.width = width;
    this.height = height;
    this.effects = [];
    
    // Create double buffers for ping-pong processing
    this.buffer1 = p5Instance.createGraphics(width, height);
    this.buffer2 = p5Instance.createGraphics(width, height);
  }

  /**
   * Add an effect to the pipeline
   * @param {Effect} effect - Effect instance to add
   */
  addEffect(effect) {
    this.effects.push(effect);
  }

  /**
   * Remove an effect from the pipeline
   * @param {number} index - Index of effect to remove
   */
  removeEffect(index) {
    if (index >= 0 && index < this.effects.length) {
      this.effects.splice(index, 1);
    }
  }

  /**
   * Reorder effects in the pipeline
   * @param {number} fromIndex - Current position
   * @param {number} toIndex - New position
   */
  reorderEffect(fromIndex, toIndex) {
    if (fromIndex >= 0 && fromIndex < this.effects.length &&
        toIndex >= 0 && toIndex < this.effects.length) {
      const effect = this.effects.splice(fromIndex, 1)[0];
      this.effects.splice(toIndex, 0, effect);
    }
  }

  /**
   * Process input through all enabled effects
   * @param {p5.Graphics|p5.Image|p5.Element} input - Input source
   * @returns {p5.Graphics} Final processed buffer
   */
  process(input) {
    if (this.effects.length === 0) {
      // No effects, just copy input to buffer
      this.buffer1.image(input, 0, 0);
      return this.buffer1;
    }

    let inputBuffer = this.buffer1;
    let outputBuffer = this.buffer2;
    
    // Copy input to first buffer
    inputBuffer.clear();
    inputBuffer.image(input, 0, 0);

    // Process through each enabled effect
    for (let i = 0; i < this.effects.length; i++) {
      const effect = this.effects[i];
      
      if (effect.isEnabled()) {
        outputBuffer.clear();
        effect.process(inputBuffer, outputBuffer);
        
        // Swap buffers for next iteration (ping-pong)
        const temp = inputBuffer;
        inputBuffer = outputBuffer;
        outputBuffer = temp;
      }
    }

    // Return the final result (in inputBuffer after last swap)
    return inputBuffer;
  }

  /**
   * Get all effects in the pipeline
   * @returns {Array<Effect>} Array of effects
   */
  getEffects() {
    return this.effects;
  }

  /**
   * Clear all effects from the pipeline
   */
  clear() {
    this.effects = [];
  }

  /**
   * Resize buffers (call when canvas size changes)
   * @param {number} width - New width
   * @param {number} height - New height
   */
  resize(width, height) {
    this.width = width;
    this.height = height;
    this.buffer1.remove();
    this.buffer2.remove();
    this.buffer1 = this.p5.createGraphics(width, height);
    this.buffer2 = this.p5.createGraphics(width, height);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EffectPipeline;
}
