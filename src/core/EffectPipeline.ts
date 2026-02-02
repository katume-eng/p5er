import type p5 from 'p5';
import { Effect } from './Effect';

/**
 * EffectPipeline manages a reorderable chain of effects
 * Each effect processes an input buffer into an output buffer
 */
export class EffectPipeline {
  p5: p5;
  width: number;
  height: number;
  effects: Effect[];
  buffer1: p5.Graphics;
  buffer2: p5.Graphics;

  constructor(p5Instance: p5, width: number, height: number) {
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
   * @param effect - Effect instance to add
   */
  addEffect(effect: Effect): void {
    this.effects.push(effect);
  }

  /**
   * Remove an effect from the pipeline
   * @param index - Index of effect to remove
   */
  removeEffect(index: number): void {
    if (index >= 0 && index < this.effects.length) {
      this.effects.splice(index, 1);
    }
  }

  /**
   * Reorder effects in the pipeline
   * @param fromIndex - Current position
   * @param toIndex - New position
   */
  reorderEffect(fromIndex: number, toIndex: number): void {
    if (fromIndex >= 0 && fromIndex < this.effects.length &&
        toIndex >= 0 && toIndex < this.effects.length) {
      const effect = this.effects.splice(fromIndex, 1)[0];
      this.effects.splice(toIndex, 0, effect);
    }
  }

  /**
   * Process input through all enabled effects
   * @param input - Input source
   * @returns Final processed buffer
   */
  process(input: p5.Graphics | p5.Image | p5.Element): p5.Graphics {
    if (this.effects.length === 0) {
      // No effects, just copy input to buffer
      this.buffer1.image(input as any, 0, 0);
      return this.buffer1;
    }

    let inputBuffer = this.buffer1;
    let outputBuffer = this.buffer2;
    
    // Copy input to first buffer
    inputBuffer.clear();
    inputBuffer.image(input as any, 0, 0);

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
   * @returns Array of effects
   */
  getEffects(): Effect[] {
    return this.effects;
  }

  /**
   * Clear all effects from the pipeline
   */
  clear(): void {
    this.effects = [];
  }

  /**
   * Resize buffers (call when canvas size changes)
   * @param width - New width
   * @param height - New height
   */
  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.buffer1.remove();
    this.buffer2.remove();
    this.buffer1 = this.p5.createGraphics(width, height);
    this.buffer2 = this.p5.createGraphics(width, height);
  }
}
