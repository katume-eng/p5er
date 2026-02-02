# p5er Demo & Setup Guide

## Quick Start

### Option 1: Using CDN (Recommended for online environments)
1. Simply open `index.html` in your browser
2. The p5.js library will be loaded from CDN
3. Allow camera access when prompted

### Option 2: Using Local p5.js (For offline or restricted environments)
1. Download p5.js from [p5js.org](https://p5js.org/download/)
2. Create a `lib` folder in the project root
3. Save `p5.min.js` in the `lib` folder
4. Edit `index.html` and uncomment the local script line:
   ```html
   <!-- <script src="lib/p5.min.js"></script> -->
   ```
5. Comment out the CDN script line
6. Open `index.html` in your browser

## Application Interface

The application has two main sections:

### 1. Canvas Area (Left)
- Displays the live processed video/image
- Shows FPS counter in top-left corner
- Real-time effect processing

### 2. Control Panel (Right)

#### Input Source Selection
Three buttons to choose input:
- **Camera**: Live webcam feed (requires camera permission)
- **Image**: Static test pattern with colorful shapes
- **Video**: Animated test pattern with moving circles

#### Effects Pipeline
Shows list of active effects:
- **Effect Name**: Click to select and view parameters
- **✓/✗ Toggle**: Enable/disable the effect
- **↑/↓ Arrows**: Reorder effects in the pipeline

#### Effect Parameters
When an effect is selected:
- Adjust effect-specific parameters
- Changes apply in real-time
- Parameters vary by effect type

## Effect Details

### Masked Noise Effect
Adds dynamic noise overlay with masking:
- **noiseScale**: Size of noise pattern (0.0-1.0)
- **noiseStrength**: Intensity of noise (0.0-1.0)
- **maskThreshold**: Brightness threshold (0-255)
- **useColorMask**: Enable color-based masking

### Delayed Frames Effect
Creates echo/trail by blending past frames:
- **delayFrames**: How many frames to delay (0-30)
- **mixAmount**: Blend ratio (0.0-1.0)
- **maxBuffers**: Memory limit for frame history

### Face Aura Effect
Adds glowing aura around faces (stubbed detection):
- **auraSize**: Radius of aura glow (0-200)
- **auraColor**: RGB color values
- **auraAlpha**: Transparency (0-255)
- **glowIntensity**: Number of glow layers (0-3)
- **useStubLandmarks**: Use simulated face position

## Usage Examples

### Example 1: Basic Echo Effect
1. Select "Camera" input
2. Disable all effects except "Delayed Frames"
3. Set `delayFrames` to 15
4. Set `mixAmount` to 0.5
5. Wave your hand to see the trail effect

### Example 2: Dreamy Aura
1. Select "Camera" input
2. Enable "Face Aura" effect
3. Set `auraSize` to 150
4. Set `glowIntensity` to 2.5
5. Position your face in the center to see the glow

### Example 3: Noise Texture Overlay
1. Select "Image" input (for static test)
2. Enable only "Masked Noise"
3. Adjust `noiseScale` to 0.02 for fine grain
4. Set `noiseStrength` to 0.4
5. See animated noise texture

### Example 4: Combined Effects
1. Select "Camera" input
2. Enable all three effects
3. Reorder them:
   - Face Aura (first)
   - Masked Noise (second)
   - Delayed Frames (third)
4. Adjust parameters to taste
5. Effects are applied in order from top to bottom

## Troubleshooting

### Camera not working
- Make sure you're using HTTPS or localhost
- Grant camera permissions in browser settings
- Try a different browser (Chrome/Firefox recommended)

### p5.js not loading
- Check browser console for errors
- Try using local p5.js instead of CDN
- Ensure internet connection for CDN version

### Performance issues
- Reduce number of active effects
- Lower `maxBuffers` in Delayed Frames effect
- Close other browser tabs
- Try a more powerful device

### Effects not visible
- Check that effects are enabled (✓ icon)
- Adjust effect parameters (some have low default values)
- Try different input sources

## Browser Console

Press F12 to open developer tools and check:
- Any JavaScript errors
- Camera initialization status
- Performance metrics

## Creating Your Own Effects

See README.md for detailed guide on creating custom effects by extending the Effect class.
