// Noise tends to look smoother with coordinates that are very close together
// These values will be multiplied by the x and y coordinates to make the

// const { read } = require("fs");

// resulting values very close together
let xScale = 0.015;
let yScale = 0.02;

let gap;
let offset;

const background_sketch = function (p) {
  let palette;
  let currentFill;
  let targetFill;
  const FADE = 0.06;

  p.setup = function () {
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.clientHeight;

    const bg_canvas = p.createCanvas(w, h).parent("pfive-container-background");

    p.pixelDensity(1);
    p.frameRate(50);

    bg_canvas.position(0, 0);
    bg_canvas.style("position", "fixed");
    bg_canvas.style("z-index", "1");

    readPalette();
    currentFill = targetFill;

    new MutationObserver(readPalette).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
  };

  function readPalette() {
    const cs = getComputedStyle(document.documentElement);
    const pick = (name, fallback) =>
      cs.getPropertyValue(name).trim() || fallback;
    palette = {
      material: pick("--color-sketch-material", "#ffffff"),
      ambient: pick("--color-sketch-ambient", "#2e2e2e"),
      key: pick("--color-sketch-key", "#ffffff"),
      noise: pick("--color-sketch-noise", "#ffffff"),
    };
    targetFill = p.color(palette.noise);
  }

  p.draw = function () {
    dotGrid();
  };

  p.windowResized = function () {
    p.resizeCanvas(
      document.documentElement.clientWidth,
      document.documentElement.clientHeight,
    );
  };

  function dotGrid() {
    p.clear();
    p.noStroke();
    currentFill = p.lerpColor(currentFill, targetFill, FADE);
    p.fill(currentFill);

    // Get the current gap and offset values from the sliders
    gap = 10; //gapSlider.value();
    offset = 1; //offsetSlider.value();

    // Loop through x and y coordinates, at increments set by gap
    for (let x = gap / 2; x < p.width; x += gap) {
      for (let y = gap / 2; y < p.height; y += gap) {
        // Calculate noise value using scaled and offset coordinates
        let noiseValue = p.noise(
          (x + offset) * xScale,
          (y + offset + window.scrollY * 0.5) * yScale,
          p.frameCount * 0.01,
        );

        // Since noiseValue will be 0-1, multiply it by gap to set diameter to
        // between 0 and the size of the gap between circles
        if (noiseValue > 0.5) {
          let diameter = (noiseValue - 0.5) * 10 * gap;
          p.circle(x, y, diameter);
        }
      }
    }
  }
};

new p5(background_sketch);
