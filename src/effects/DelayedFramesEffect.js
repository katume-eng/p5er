/**
 * DelayedFramesEffect - Creates echo/trail effect by mixing delayed frames
 * Demonstrates temporal buffering and frame history
 */
class DelayedFramesEffect extends Effect {
  constructor(p5Instance) {
    super('Delayed Frames', p5Instance);
    
    // Initialize parameters
    this.parameters = {
      delayFrames: 10,
      mixAmount: 0.5,
      maxBuffers: 30
    };
    
    // Frame history buffer
    this.frameHistory = [];
  }

  /**
   * Process input with delayed frame mixing
   * @param {p5.Graphics} inputBuffer - Source buffer
   * @param {p5.Graphics} outputBuffer - Destination buffer
   */
  process(inputBuffer, outputBuffer) {
    const p = this.p5;
    const w = inputBuffer.width;
    const h = inputBuffer.height;
    const delayFrames = Math.floor(this.parameters.delayFrames);
    const mixAmount = this.parameters.mixAmount;
    
    // Store current frame in history
    const currentFrame = p.createGraphics(w, h);
    currentFrame.image(inputBuffer, 0, 0);
    this.frameHistory.push(currentFrame);
    
    // Limit buffer size to prevent memory issues
    const maxBuffers = this.parameters.maxBuffers;
    while (this.frameHistory.length > maxBuffers) {
      const oldFrame = this.frameHistory.shift();
      oldFrame.remove();
    }
    
    // Get delayed frame
    const delayIndex = Math.max(0, this.frameHistory.length - 1 - delayFrames);
    
    if (this.frameHistory.length > delayFrames) {
      const delayedFrame = this.frameHistory[delayIndex];
      
      // Mix current and delayed frames
      outputBuffer.clear();
      
      // Draw delayed frame
      outputBuffer.push();
      outputBuffer.tint(255, 255 * mixAmount);
      outputBuffer.image(delayedFrame, 0, 0);
      outputBuffer.pop();
      
      // Draw current frame
      outputBuffer.push();
      outputBuffer.tint(255, 255 * (1 - mixAmount));
      outputBuffer.image(inputBuffer, 0, 0);
      outputBuffer.pop();
      
      outputBuffer.noTint();
    } else {
      // Not enough frames yet, just pass through
      outputBuffer.image(inputBuffer, 0, 0);
    }
  }

  /**
   * Clear frame history
   */
  clearHistory() {
    for (let frame of this.frameHistory) {
      frame.remove();
    }
    this.frameHistory = [];
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DelayedFramesEffect;
}
