import type p5 from 'p5';
import { Effect } from '../core/Effect';

interface MaskedNoiseParameters {
  noiseScale: number;
  noiseStrength: number;
  maskThreshold: number;
  useColorMask: boolean;
}

/**
 * MaskedNoiseEffect - Applies noise overlay with masking
 * Demonstrates offscreen buffer manipulation and masking
 */
export class MaskedNoiseEffect extends Effect {
  parameters: MaskedNoiseParameters;
  noiseBuffer: p5.Graphics | null;

  constructor(p5Instance: p5) {
    super('Masked Noise', p5Instance);
    
    // Initialize parameters
    this.parameters = {
      noiseScale: 0.01,
      noiseStrength: 0.3,
      maskThreshold: 128,
      useColorMask: false
    };
    
    // Create offscreen buffer for noise
    this.noiseBuffer = null;
  }

  /**
   * Process input with masked noise overlay
   * @param inputBuffer - Source buffer
   * @param outputBuffer - Destination buffer
   */
  process(inputBuffer: p5.Graphics, outputBuffer: p5.Graphics): void {
    const p = this.p5;
    const w = inputBuffer.width;
    const h = inputBuffer.height;
    
    // Create noise buffer if needed
    if (!this.noiseBuffer || this.noiseBuffer.width !== w || this.noiseBuffer.height !== h) {
      if (this.noiseBuffer) this.noiseBuffer.remove();
      this.noiseBuffer = p.createGraphics(w, h);
    }
    
    // Generate noise pattern
    this.noiseBuffer.loadPixels();
    const noiseScale = this.parameters.noiseScale;
    const noiseStrength = this.parameters.noiseStrength;
    
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const noiseVal = p.noise(x * noiseScale, y * noiseScale, p.frameCount * 0.01);
        const gray = p.map(noiseVal, 0, 1, 0, 255);
        
        this.noiseBuffer.pixels[idx] = gray;
        this.noiseBuffer.pixels[idx + 1] = gray;
        this.noiseBuffer.pixels[idx + 2] = gray;
        this.noiseBuffer.pixels[idx + 3] = 255 * noiseStrength;
      }
    }
    this.noiseBuffer.updatePixels();
    
    // Create mask from input
    inputBuffer.loadPixels();
    const maskBuffer = p.createGraphics(w, h);
    maskBuffer.loadPixels();
    
    const maskThreshold = this.parameters.maskThreshold;
    const useColorMask = this.parameters.useColorMask;
    
    for (let i = 0; i < inputBuffer.pixels.length; i += 4) {
      if (useColorMask) {
        // Use color brightness as mask
        const brightness = (inputBuffer.pixels[i] + inputBuffer.pixels[i + 1] + inputBuffer.pixels[i + 2]) / 3;
        maskBuffer.pixels[i + 3] = brightness > maskThreshold ? 255 : 0;
      } else {
        // Use simple threshold
        maskBuffer.pixels[i + 3] = 255;
      }
    }
    maskBuffer.updatePixels();
    
    // Composite: input + masked noise
    outputBuffer.image(inputBuffer, 0, 0);
    
    // Apply noise with masking
    outputBuffer.push();
    outputBuffer.blendMode(p.OVERLAY);
    outputBuffer.image(this.noiseBuffer, 0, 0);
    outputBuffer.pop();
    
    // Clean up temporary buffer
    maskBuffer.remove();
  }
}
