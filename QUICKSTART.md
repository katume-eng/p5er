# Quick Start Guide

## Running the Application

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

The application will open automatically at `http://localhost:3000`

### Step 3: Grant Camera Access (Optional)
If using camera input:
- Click "Allow" when prompted for camera access
- Or select "Image" or "Video" for test inputs

### Step 4: Explore the Interface

#### Left Panel - Canvas
- Live preview of effects
- FPS counter in top-left

#### Right Panel - Controls

**Input Source** (top buttons)
- 📷 Camera - Live webcam
- 🖼️ Image - Static test pattern  
- 🎬 Video - Animated test pattern

**Effects Pipeline** (middle section)
- Click effect name to select
- ✓/✗ button to enable/disable
- ↑/↓ arrows to reorder

**Effect Parameters** (bottom section)
- Appears when effect is selected
- Adjust sliders for real-time changes
- Toggle checkboxes for options

## Try These First

### 1. Echo Effect
1. Select "Camera" input
2. Disable all effects except "Delayed Frames"
3. Set `delayFrames` to 10-15
4. Set `mixAmount` to 0.5
5. Move your hand to see trails

### 2. Noise Overlay
1. Select "Image" input
2. Enable only "Masked Noise"
3. Adjust `noiseScale` to 0.02
4. Watch the animated texture

### 3. Face Glow
1. Select "Camera" input
2. Enable only "Face Aura"
3. Set `auraSize` to 120
4. Center your face to see the glow

### 4. Combined Effects
1. Select "Camera" input
2. Enable all three effects
3. Reorder them as desired
4. Adjust parameters to create unique looks

## Keyboard Tips

- F12 - Open developer console
- F5 - Reload application
- Ctrl/Cmd + Shift + I - Developer tools

## Troubleshooting

**Camera won't start:**
- Ensure you're on HTTPS or localhost
- Check browser permissions
- Try another browser

**Poor performance:**
- Disable some effects
- Close other browser tabs
- Try "Image" input instead of "Camera"

**Effects not working:**
- Check that effects are enabled (✓ icon)
- Adjust parameter values
- Reload the page

## Building for Production

To create an optimized production build:
```bash
npm run build
```

Files will be generated in the `dist/` directory.

To preview the production build:
```bash
npm run preview
```

## Next Steps

- Read `DEMO.md` for detailed usage examples
- Read `README.md` for architecture details
- Try creating your own custom effect!

## Need Help?

Check the browser console (F12) for error messages and status updates.
