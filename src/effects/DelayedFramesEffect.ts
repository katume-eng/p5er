import type p5 from 'p5';
import { Effect } from '../core/Effect';

interface DelayedFramesParameters {
  delayFrames: number;
  mixAmount: number;
  maxBuffers: number;
}

/**
 * DelayedFramesEffect - Creates echo/trail effect by mixing delayed frames
 * Demonstrates temporal buffering and frame history
 */
export class DelayedFramesEffect extends Effect {
  parameters: DelayedFramesParameters;
  frameHistory: p5.Graphics[];

  constructor(p5Instance: p5) {
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
   * @param inputBuffer - Source buffer
   * @param outputBuffer - Destination buffer
   */
  process(inputBuffer: p5.Graphics, outputBuffer: p5.Graphics): void {
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
  clearHistory(): void {
    for (let frame of this.frameHistory) {
      frame.remove();
    }
    this.frameHistory = [];
  }
}
