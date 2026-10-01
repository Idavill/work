let generalMargin = 30;
let flat;
// let textured_output;
let bungeeFont;
let color;
let amount = 100;

// --- 3d text settings ---
// the face itself is per theme and comes from --sketch-face in index.css,
// next to that theme's colours. this is only the fallback for a theme that
// forgot to set one. other cute ones to try:
//   "(◕‿◕)"   "(｡◕‿◕｡)"   "ʕ•ᴥ•ʔ"   "(=^･ω･^=)"   "^_^"   "(·_·)"
const FALLBACK_TEXT = "ʕ•ᴥ•ʔ";
let text = FALLBACK_TEXT;
const RES = 6; // sampling step: smaller = more boxes, more detail, slower
const DEPTH = 70; // how far the letters extrude
// kaomoji glyphs don't exist in display faces like Bungee Spice, so the
// browser falls back per-glyph and the eyes end up a different size from
// the brackets. a plain ui font has the whole set and stays consistent.
const FONT_STACK =
  '-apple-system, "Poppins", "Segoe UI Symbol", "Apple Symbols", sans-serif';

// the face is always sampled into a buffer of this fixed size, so the box
// count depends only on how much ink the face has and never on the viewport.
// we then scale the whole drawing to fit whatever size the canvas happens
// to be. note the face is fitted to the buffer WIDTH, so a face with more
// glyphs is drawn smaller rather than wider — box count stays in the same
// ballpark across faces instead of growing with their length.
const BUF_W = 2000;
const BUF_H = 2000;

// how much of the canvas the face fills, 1 = hard against the edges. this is
// the dial for "bigger face" — it is applied to a fit measured from the face's
// own ink bounds (see ink below), not from the buffer, so it means what it says.
const FILL = 0.92;

let cells = [];
let gfx;

// bounding box of the sampled ink, in the same buffer-centred coords as cells,
// plus its centre. draw() fits and centres on THIS rather than on the buffer:
// the buffer is square and the face only ever occupies a band across its
// middle, so fitting the whole 2000x2000 spent most of the scale on blank
// space and drew the face far smaller than the canvas allowed. defaults are
// the buffer size so a draw before the first sample still behaves.
let ink = { w: BUF_W, h: BUF_H, cx: 0, cy: 0 };

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

// --sketch-face is stored quoted so a paren or semicolon in the face can't
// break css parsing. getPropertyValue hands back the quotes, so strip them.
// returns true if the face actually changed, since resampling costs a
// full-buffer pixel readback and only the face affects it.
function readFace() {
  const cs = getComputedStyle(document.documentElement);
  const raw = cs.getPropertyValue("--sketch-face").trim();
  const next = raw.replace(/^["']|["']$/g, "") || FALLBACK_TEXT;
  if (next === text) return false;
  text = next;
  return true;
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
      host && host.clientHeight
        ? host.clientHeight
        : p.windowHeight * 0.6 * 1.2;
    return { w, h };
  }

  // draw the current face into an offscreen 2d buffer, then keep one cell
  // per opaque pixel. extrude in draw(). called on first paint, once fonts
  // load, and on each theme change that brings a different face.
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

    // scale type so the face always fills buffer
    let size = 280;
    gfx.textSize(size);
    const measured = gfx.textWidth(text);
    if (measured > 0) {
      gfx.textSize(size * ((w * 0.9) / measured));
    }
    gfx.text(text, w / 2, h / 2);

    gfx.loadPixels();
    const next = [];
    // track the ink bounds while sampling — it costs nothing here and saves
    // draw() from measuring 30k cells every frame
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (let y = 0; y < h; y += RES) {
      for (let x = 0; x < w; x += RES) {
        // alpha channel: anything opaque is part of letter
        if (gfx.pixels[(y * w + x) * 4 + 3] > 128) {
          const cx = x - w / 2;
          const cy = y - h / 2;
          next.push({ x: cx, y: cy });
          if (cx < minX) minX = cx;
          if (cx > maxX) maxX = cx;
          if (cy < minY) minY = cy;
          if (cy > maxY) maxY = cy;
        }
      }
    }
    cells = next;

    if (next.length) {
      // + RES because minX/maxX are box centres on the sampling grid, so the
      // ink reaches half a step past each of them
      ink = {
        w: maxX - minX + RES,
        h: maxY - minY + RES,
        cx: (minX + maxX) / 2,
        cy: (minY + maxY) / 2,
      };
    }
  }

  p.setup = function () {
    const { w, h } = hostSize();
    canvas1 = p.createCanvas(w, h, p.WEBGL).parent("#topSketch");
    canvas1.style("display", "flex");
    p.pixelDensity(1);

    readPalette();
    readFace();
    // the theme toggle flips data-theme on <html>: recolour always, and
    // resample the boxes only when that theme's face differs from the one
    // already on screen.
    new MutationObserver(function () {
      readPalette();
      if (readFace()) buildCells();
    }).observe(document.documentElement, {
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

    // fit the face to the current canvas: whichever axis is tightest wins, so
    // it never spills out on narrow screens. measured from the ink bounds, so
    // the face grows to the canvas instead of to the mostly-empty buffer.
    const fit = Math.min(p.width / ink.w, p.height / ink.h) * FILL;
    p.scale(fit);
    // ink is not exactly buffer-centred — kaomoji glyph boxes are lopsided —
    // so recentre on the ink itself now that it fills the frame
    p.translate(-ink.cx, -ink.cy);

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
