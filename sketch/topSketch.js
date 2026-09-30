let generalMargin = 30;
let flat;
// let textured_output;
let bungeeFont;
let color;
let amount = 100;

// --- 3d text settings ---
// other cute ones to try:
//   "(◕‿◕)"   "(｡◕‿◕｡)"   "ʕ•ᴥ•ʔ"   "(=^･ω･^=)"   "^_^"   "(·_·)"
const TEXT = "ʕ•ᴥ•ʔ";
const RES = 6; // sampling step: smaller = more boxes, more detail, slower
const DEPTH = 70; // how far the letters extrude
// kaomoji glyphs don't exist in display faces like Bungee Spice, so the
// browser falls back per-glyph and the eyes end up a different size from
// the brackets. a plain ui font has the whole set and stays consistent.
const FONT_STACK =
  '-apple-system, "Poppins", "Segoe UI Symbol", "Apple Symbols", sans-serif';

// the word is always sampled at this fixed resolution, so the number of
// boxes stays constant. we then scale the whole drawing to fit whatever
// size the canvas happens to be.
const BUF_W = 1060;
const BUF_H = 820;

let cells = [];
let gfx;

// the sketch reads its colours from the css theme tokens in index.css,
// so switching theme repaints the 3d text along with everything else.
let palette = {
  material: "#ffffff",
  ambient: "#2e2e2e",
  key: "#ffffff",
};

function readPalette() {
  const cs = getComputedStyle(document.documentElement);
  const pick = (name, fallback) => cs.getPropertyValue(name).trim() || fallback;
  palette = {
    material: pick("--color-sketch-material", "#ffffff"),
    ambient: pick("--color-sketch-ambient", "#2e2e2e"),
    key: pick("--color-sketch-key", "#ffffff"),
  };
}

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

  // measure the div the sketch lives in, so the canvas matches the layout
  function hostSize() {
    const host = document.getElementById("topSketch");
    const w = host && host.clientWidth ? host.clientWidth : p.windowWidth;
    const h =
      host && host.clientHeight ? host.clientHeight : p.windowHeight * 0.6;
    return { w, h };
  }

  // draw TEXT into an offscreen 2d buffer, then keep one cell per
  // opaque pixel. extrude in draw().
  function buildCells() {
    const w = BUF_W;
    const h = BUF_H;

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
    const { w, h } = hostSize();
    canvas1 = p.createCanvas(w, h, p.WEBGL).parent("#topSketch");
    canvas1.style("display", "flex");
    p.pixelDensity(1);

    readPalette();
    // repaint when the theme toggle flips data-theme on <html>
    new MutationObserver(readPalette).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    buildCells();
    // google fonts may still be loading on first paint, so resample
    // once they're ready or the text falls back to plain sans-serif
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(buildCells);
    }
  };

  // follow the layout when the window changes. the sampled cells don't
  // need rebuilding — only the scale factor in draw() changes.
  p.windowResized = function () {
    const { w, h } = hostSize();
    p.resizeCanvas(w, h);
  };

  p.draw = function () {
    // clear() wipes to transparent so the page shows through. without it
    // webgl keeps every previous frame, so the word drawn in the fallback
    // font stays burned in after the real font loads and cells rebuild.
    p.clear();
    p.push();

    // ambient is flat and directionless — it sets the SHADOW floor, the
    // darkest any face gets. keep it dark or the word goes flat.
    p.ambientLight(p.color(palette.ambient));

    // the key light is the only thing that differentiates faces, so it
    // provides all the shading. it orbits, so the highlight travels.
    const angle = p.frameCount * 0.02;
    const lx = 150 * Math.cos(angle);
    const ly = 200 * Math.sin(angle);
    const lz = 100 * Math.sin(angle * 0.98);
    p.directionalLight(p.color(palette.key), p.createVector(lx, ly, lz));

    // seen straight on, every box shows only its +z face — all normals
    // identical, so no light can shade one differently from another. a
    // small fixed tilt exposes the tops and sides, and THAT is what reads
    // as depth. raise these for a more dramatic angle.
    p.rotateX(-0.18);
    p.rotateY(0.14);

    // fit the word to the current canvas: whichever axis is tightest wins,
    // so the text never spills out on narrow screens
    const fit = Math.min(p.width / BUF_W, p.height / BUF_H);
    p.scale(fit);

    p.noStroke();
    // both are needed: ambientMaterial is what ambient light reflects,
    // fill is what the directional light shades. set only one and the
    // other half of the lighting falls back to default white.
    const material = p.color(palette.material);
    p.ambientMaterial(material);
    p.fill(material);

    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      // ripple the depth across the word
      let mouseD =
        p.dist(c.x, c.y, p.mouseX - BUF_W / 2, p.mouseY - BUF_H / 2) * 0.005;

      const d =
        DEPTH * (0.6 + 0.4 * Math.sin(p.frameCount * 0.05 + c.x * 0.02)) * 0.05;
      mouseD;
      p.push();
      p.translate(c.x, c.y);
      p.box(RES * 0.9, RES * 0.9, d);
      p.pop();
    }
    p.pop();
  };
}

// #topSketch is rendered by react, which mounts after this script runs.
// starting p5 too early means .parent() finds nothing and the canvas is
// left at the end of <body> — below the footer, stretching the page.
// so wait until the container actually exists.
function startTopSketch() {
  if (document.getElementById("topSketch")) {
    new p5(s1);
  } else {
    requestAnimationFrame(startTopSketch);
  }
}
startTopSketch();
