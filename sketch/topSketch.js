let generalMargin = 30;
let flat;
// let textured_output;
let bungeeFont;
let color;
let amount = 100;

// --- 3d text settings ---
const TEXT = "dive";
const RES = 8; // sampling step: smaller = more boxes, more detail, slower
const DEPTH = 70; // how far the letters extrude
const FONT_STACK = '"Bungee Spice", "Koulen", "Poppins", sans-serif';

let cells = [];
let gfx;

function s1(p) {
  p.preload = function () {
    // bungeeFont = p.loadFont("images/BungeeSpice-Regular.ttf");
    // textured_output = p.loadModel(
    //   "images/textured_output.obj",
    //   true,
    //   () => {
    //     console.log("Model loaded successfully");
    //   },
    //   (err) => {
    //     console.error("Error loading model:", err);
    //   }
    // );
  };

  // draw TEXT into an offscreen 2d buffer, then keep one cell per
  // opaque pixel. extrude in draw().
  function buildCells() {
    const w = 1060;
    const h = 820;

    if (!gfx) {
      gfx = p.createGraphics(w, h);
      gfx.pixelDensity(1); // keeps the pixel indexing below 1:1
    }
    gfx.clear();
    gfx.noStroke();
    gfx.fill(255);
    gfx.textFont(FONT_STACK);
    gfx.textAlign(gfx.CENTER, gfx.CENTER);

    // scale type so TEXT always fills buffer
    let size = 280;
    gfx.textSize(size);
    const measured = gfx.textWidth(TEXT);
    if (measured > 0) {
      gfx.textSize(size * ((w * 0.9) / measured));
    }
    gfx.text(TEXT, w / 2, h / 2);

    gfx.loadPixels();
    const next = [];
    for (let y = 0; y < h; y += RES) {
      for (let x = 0; x < w; x += RES) {
        // alpha channel: anything opaque is part of letter
        if (gfx.pixels[(y * w + x) * 4 + 3] > 128) {
          next.push({ x: x - w / 2, y: y - h / 2 });
        }
      }
    }
    cells = next;
  }

  p.setup = function () {
    canvas1 = p.createCanvas(1000, 1000, p.WEBGL).parent("#topSketch");
    canvas1.style("display", "flex");
    p.pixelDensity(1);

    color = p.color(10, 100, 10); // color on text

    buildCells();
    // google fonts may still be loading on first paint, so resample
    // once they're ready or the text falls back to plain sans-serif
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(buildCells);
    }
  };

  p.draw = function () {
    // p.background(0, 50, 200, 10);
    p.push();
    // p.ambientLight(10, 100, 220); // blue
    // p.ambientLight(170, 80, 40); // orange
    // p.ambientLight(10, 120, 120); // tyrkis
    p.ambientLight(10, 220, 10); //

    const angle = p.frameCount * 0.02;
    const lx = 150 * Math.cos(angle);
    const ly = 200 * Math.sin(angle);
    const lz = 100 * Math.sin(angle * 0.98);

    p.directionalLight(255, 20, 100, lx, ly, lz);

    // gentle tumble so the extrusion actually reads as 3d
    // p.rotateY(Math.sin(p.frameCount * 0.01) * 0.6);
    // p.rotateX(Math.cos(p.frameCount * 0.008) * 0.25);

    p.noStroke();
    p.ambientMaterial(color);

    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      // ripple the depth across the word
      const d =
        DEPTH * (0.6 + 0.4 * Math.sin(p.frameCount * 0.05 + c.x * 0.02));
      p.push();
      p.translate(c.x, c.y, 0);
      p.box(RES * 0.9, RES * 0.9, d);
      p.pop();
    }
    p.pop();
  };
}

new p5(s1);
