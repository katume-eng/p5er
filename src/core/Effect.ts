import type p5 from 'p5';

/**
 * Base Effect class for creating modular effects
 * Each effect processes an input buffer and writes to an output buffer
 */
export class Effect {
  name: string;
  p5: p5;
  enabled: boolean;
  parameters: Record<string, any>;

  constructor(name: string, p5Instance: p5) {
    this.name = name;
    this.p5 = p5Instance;
    this.enabled = true;
    this.parameters = {};
  }

  /**
   * Process the input buffer and write to output buffer
   * @param inputBuffer - Source buffer to process
   * @param outputBuffer - Destination buffer for result
   */
  process(inputBuffer: p5.Graphics, outputBuffer: p5.Graphics): void {
    // Default behavior: pass through
    outputBuffer.image(inputBuffer, 0, 0);
  }

  /**
   * Set a parameter value
   * @param key - Parameter name
   * @param value - Parameter value
   */
  setParameter(key: string, value: any): void {
    this.parameters[key] = value;
  }

  /**
   * Get a parameter value
   * @param key - Parameter name
   * @returns Parameter value
   */
  getParameter(key: string): any {
    return this.parameters[key];
  }

  /**
   * Enable or disable this effect
   * @param enabled - Whether effect is enabled
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Check if effect is enabled
   * @returns Whether effect is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Get effect metadata for UI
   * @returns Effect metadata
   */
  getMetadata(): { name: string; enabled: boolean; parameters: Record<string, any> } {
    return {
      name: this.name,
      enabled: this.enabled,
      parameters: this.parameters
    };
  }
}
