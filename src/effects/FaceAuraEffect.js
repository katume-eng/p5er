/**
 * FaceAuraEffect - Creates an aura around detected faces
 * Uses stubbed face landmarks for demonstration purposes
 * In production, could integrate with ml5.js or TensorFlow.js
 */
class FaceAuraEffect extends Effect {
  constructor(p5Instance) {
    super('Face Aura', p5Instance);
    
    // Initialize parameters
    this.parameters = {
      auraSize: 100,
      auraColor: [255, 100, 200],
      auraAlpha: 100,
      glowIntensity: 2.0,
      useStubLandmarks: true
    };
    
    // Stubbed face landmarks (center of screen for demo)
    this.stubbedLandmarks = null;
  }

  /**
   * Get stubbed face landmarks (simulated detection)
   * @param {number} w - Canvas width
   * @param {number} h - Canvas height
   * @returns {Array} Array of face landmark objects
   */
  getStubbedLandmarks(w, h) {
    // Simulate a face in the center-upper area
    const centerX = w / 2;
    const centerY = h / 2.5;
    const faceWidth = w * 0.2;
    const faceHeight = h * 0.25;
    
    return [{
      x: centerX,
      y: centerY,
      width: faceWidth,
      height: faceHeight,
      // Simulate face moving slightly based on noise
      offsetX: this.p5.noise(this.p5.frameCount * 0.01) * 20 - 10,
      offsetY: this.p5.noise(this.p5.frameCount * 0.01 + 100) * 20 - 10
    }];
  }

  /**
   * Process input with face aura overlay
   * @param {p5.Graphics} inputBuffer - Source buffer
   * @param {p5.Graphics} outputBuffer - Destination buffer
   */
  process(inputBuffer, outputBuffer) {
    const p = this.p5;
    const w = inputBuffer.width;
    const h = inputBuffer.height;
    
    // Start with input
    outputBuffer.image(inputBuffer, 0, 0);
    
    // Get face landmarks (stubbed for now)
    const landmarks = this.parameters.useStubLandmarks 
      ? this.getStubbedLandmarks(w, h)
      : [];
    
    // Draw aura for each detected face
    for (let face of landmarks) {
      const x = face.x + face.offsetX;
      const y = face.y + face.offsetY;
      const auraSize = this.parameters.auraSize;
      const color = this.parameters.auraColor;
      const alpha = this.parameters.auraAlpha;
      const glowIntensity = this.parameters.glowIntensity;
      
      // Create aura with multiple layers for glow effect
      outputBuffer.push();
      outputBuffer.noStroke();
      outputBuffer.blendMode(p.ADD);
      
      // Draw multiple concentric circles for glow
      for (let i = glowIntensity; i > 0; i -= 0.2) {
        const size = auraSize * i;
        const layerAlpha = alpha / i;
        outputBuffer.fill(color[0], color[1], color[2], layerAlpha);
        outputBuffer.ellipse(x, y, size, size);
      }
      
      outputBuffer.pop();
    }
  }

  /**
   * Set face detection source (stub vs real ML model)
   * @param {boolean} useStub - Whether to use stubbed landmarks
   */
  setUseStubLandmarks(useStub) {
    this.parameters.useStubLandmarks = useStub;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FaceAuraEffect;
}
