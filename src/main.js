/**
 * Main Application - p5.js instance mode
 * Initializes the effect pipeline and manages input sources
 */

// Create p5 instance
const sketch = (p) => {
  let pipeline;
  let uiController;
  let capture;
  let testImage;
  let testVideo;
  let currentInput;
  
  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 480;

  /**
   * p5.js setup function
   */
  p.setup = () => {
    // Create canvas
    const canvas = p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('canvas-container');

    // Initialize effect pipeline
    pipeline = new EffectPipeline(p, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Add example effects
    const maskedNoise = new MaskedNoiseEffect(p);
    const delayedFrames = new DelayedFramesEffect(p);
    const faceAura = new FaceAuraEffect(p);

    pipeline.addEffect(maskedNoise);
    pipeline.addEffect(delayedFrames);
    pipeline.addEffect(faceAura);

    // Initialize UI controller
    uiController = new UIController(pipeline);
    uiController.createUI('ui-container');

    // Set up UI callbacks
    uiController.onInputSourceChange((source) => {
      switchInputSource(source);
    });

    // Initialize camera
    initCamera();
    currentInput = capture;

    p.frameRate(30);
  };

  /**
   * p5.js draw function
   */
  p.draw = () => {
    p.background(0);

    // Check if we have valid input
    if (!currentInput) {
      p.fill(255);
      p.textAlign(p.CENTER, p.CENTER);
      p.text('Waiting for input...', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      return;
    }

    // For video elements, check if ready
    if (currentInput.elt && currentInput.elt.tagName === 'VIDEO') {
      if (currentInput.elt.readyState < 2) {
        p.fill(255);
        p.textAlign(p.CENTER, p.CENTER);
        p.text('Loading video...', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        return;
      }
    }

    // Process input through effect pipeline
    const result = pipeline.process(currentInput);

    // Display the result
    p.image(result, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Display FPS
    p.fill(255, 255, 0);
    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(12);
    p.text(`FPS: ${p.frameRate().toFixed(1)}`, 10, 10);
  };

  /**
   * Initialize camera capture
   */
  function initCamera() {
    if (capture) {
      capture.remove();
    }
    
    capture = p.createCapture(p.VIDEO, () => {
      console.log('Camera initialized');
    });
    capture.size(CANVAS_WIDTH, CANVAS_HEIGHT);
    capture.hide();
  }

  /**
   * Load test image
   */
  function loadTestImage() {
    // Create a test pattern if no image is available
    if (!testImage) {
      testImage = p.createGraphics(CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Draw a colorful test pattern
      for (let y = 0; y < CANVAS_HEIGHT; y += 20) {
        for (let x = 0; x < CANVAS_WIDTH; x += 20) {
          testImage.fill(
            p.map(x, 0, CANVAS_WIDTH, 0, 255),
            p.map(y, 0, CANVAS_HEIGHT, 0, 255),
            200
          );
          testImage.noStroke();
          testImage.rect(x, y, 20, 20);
        }
      }
      
      // Add some shapes
      testImage.fill(255, 200, 100, 150);
      testImage.ellipse(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 200, 200);
      
      testImage.fill(100, 200, 255, 150);
      testImage.rect(CANVAS_WIDTH / 3, CANVAS_HEIGHT / 3, 150, 150);
    }
    
    return testImage;
  }

  /**
   * Load test video (creates an animated test pattern)
   */
  function loadTestVideo() {
    if (!testVideo) {
      testVideo = p.createGraphics(CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    
    // Create animated test pattern
    testVideo.background(0);
    
    const time = p.frameCount * 0.02;
    for (let i = 0; i < 10; i++) {
      const x = p.map(p.sin(time + i * 0.5), -1, 1, 0, CANVAS_WIDTH);
      const y = p.map(p.cos(time + i * 0.3), -1, 1, 0, CANVAS_HEIGHT);
      
      testVideo.fill(
        p.map(i, 0, 10, 100, 255),
        p.map(p.sin(time + i), -1, 1, 100, 255),
        200,
        100
      );
      testVideo.noStroke();
      testVideo.ellipse(x, y, 50, 50);
    }
    
    return testVideo;
  }

  /**
   * Switch input source
   * @param {string} source - 'camera', 'image', or 'video'
   */
  function switchInputSource(source) {
    console.log('Switching to input source:', source);
    
    switch (source) {
      case 'camera':
        if (!capture) {
          initCamera();
        }
        currentInput = capture;
        break;
        
      case 'image':
        currentInput = loadTestImage();
        break;
        
      case 'video':
        currentInput = loadTestVideo();
        break;
    }
  }
};

// Create p5 instance when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new p5(sketch);
  });
} else {
  new p5(sketch);
}
