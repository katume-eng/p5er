# p5er - Modular p5.js Effects Pipeline

A modular creative application for applying multiple visual effects to images, video, and live camera input. Built with p5.js instance mode, featuring an extensible effect pipeline with independent, reorderable effect modules.

## Features

- **Modular Effect System**: Independent effect modules that can be easily added, removed, and reordered
- **Multiple Input Sources**: Support for camera, images, and video
- **Offscreen Buffer Processing**: Each effect processes input buffers to output buffers using p5.js Graphics objects
- **Real-time Processing**: Effects are applied in real-time with visual feedback
- **Extensible Architecture**: Easy to create new effects by extending the base Effect class
- **Separated UI and Rendering**: Clean separation between user interface and visual processing

## Demo Effects

### 1. Masked Noise Effect
Applies a dynamic noise overlay with masking capabilities. Demonstrates offscreen buffer manipulation and blending modes.

**Parameters:**
- `noiseScale`: Controls the scale of noise pattern (0-1)
- `noiseStrength`: Controls the intensity of noise overlay (0-1)
- `maskThreshold`: Threshold for masking (0-255)
- `useColorMask`: Toggle color-based masking

### 2. Delayed Frames Effect
Creates an echo/trail effect by mixing current frames with delayed frames. Demonstrates temporal buffering.

**Parameters:**
- `delayFrames`: Number of frames to delay (0-30)
- `mixAmount`: Blend amount between current and delayed frames (0-1)
- `maxBuffers`: Maximum number of frames to store in memory

### 3. Face Aura Effect
Adds a glowing aura around detected faces. Uses stubbed landmarks for demonstration (can be replaced with real ML models like ml5.js or TensorFlow.js).

**Parameters:**
- `auraSize`: Size of the aura effect (0-200)
- `auraColor`: RGB color array for the aura
- `auraAlpha`: Transparency of the aura (0-255)
- `glowIntensity`: Intensity of the glow layers (0-3)
- `useStubLandmarks`: Toggle between stubbed and real face detection

## Architecture

### Core Components

#### `Effect` (Base Class)
Abstract base class for all effects. Provides standard interface for:
- Processing input/output buffers
- Managing parameters
- Enable/disable functionality
- Metadata for UI

#### `EffectPipeline`
Manages the effect processing chain:
- Maintains ordered list of effects
- Implements ping-pong buffering for efficient processing
- Handles effect reordering
- Processes input through all enabled effects sequentially

#### `UIController`
Manages user interface separately from rendering:
- Effect list with enable/disable toggles
- Effect reordering controls (up/down)
- Parameter adjustment controls
- Input source selection

### Effect Processing Flow

```
Input Source (Camera/Image/Video)
        ↓
Effect Pipeline
        ↓
Effect 1 → Buffer A → Buffer B
        ↓
Effect 2 → Buffer B → Buffer A
        ↓
Effect 3 → Buffer A → Buffer B
        ↓
Final Output → Canvas
```

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/katume-eng/p5er.git
cd p5er
```

2. Open `index.html` in a modern web browser

No build process required! The application runs directly in the browser.

### Usage

1. **Select Input Source**: Choose between Camera, Image, or Video
2. **Toggle Effects**: Click the ✓/✗ button to enable/disable effects
3. **Reorder Effects**: Use ↑/↓ buttons to change effect order
4. **Adjust Parameters**: Click an effect to show its parameters and adjust values

## Creating Custom Effects

To create a new effect, extend the `Effect` base class:

```javascript
class MyCustomEffect extends Effect {
  constructor(p5Instance) {
    super('My Custom Effect', p5Instance);
    
    // Initialize parameters
    this.parameters = {
      intensity: 0.5,
      color: [255, 0, 0]
    };
  }

  process(inputBuffer, outputBuffer) {
    const p = this.p5;
    
    // Your effect logic here
    // Read from inputBuffer, write to outputBuffer
    
    outputBuffer.image(inputBuffer, 0, 0);
    // ... apply your transformations
  }
}
```

Then add it to the pipeline in `main.js`:

```javascript
const myEffect = new MyCustomEffect(p);
pipeline.addEffect(myEffect);
```

## Project Structure

```
p5er/
├── index.html              # Main HTML file
├── styles.css              # Application styles
├── src/
│   ├── core/
│   │   ├── Effect.js       # Base effect class
│   │   └── EffectPipeline.js  # Pipeline manager
│   ├── effects/
│   │   ├── MaskedNoiseEffect.js
│   │   ├── DelayedFramesEffect.js
│   │   └── FaceAuraEffect.js
│   ├── ui/
│   │   └── UIController.js # UI management
│   └── main.js             # Application entry point
└── assets/                 # Optional asset directory
```

## Technical Details

### p5.js Instance Mode
The application uses p5.js instance mode to avoid global namespace pollution and allow multiple instances if needed.

### Buffer Management
- Uses ping-pong buffering for efficient multi-effect processing
- Each effect receives an input buffer and writes to an output buffer
- Buffers are swapped between effects to minimize memory allocation

### Extensibility
The architecture is designed for easy extension:
- New effects just need to extend `Effect` class
- No modification to core pipeline required
- UI automatically adapts to effect parameters

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (camera requires HTTPS)

**Note**: Camera access requires HTTPS in production or localhost in development.

## Future Enhancements

- [ ] Integration with real ML models (ml5.js, TensorFlow.js)
- [ ] Effect presets and saving/loading
- [ ] Export processed video/images
- [ ] More built-in effects (blur, color grading, distortion, etc.)
- [ ] Performance optimizations for mobile devices
- [ ] WebGL shader-based effects

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## Credits

Built with [p5.js](https://p5js.org/) - A JavaScript library for creative coding.
