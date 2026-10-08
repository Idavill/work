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
// a face is a LIST of lines, so a theme can stack a row of stars above and
// below the kaomoji. one entry per line, drawn centred on each other.
const FALLBACK_TEXT = ["ʕ•ᴥ•ʔ"];
let lines = FALLBACK_TEXT;
// line spacing as a multiple of the type size. the kaomoji and the star rows
// are sampled as one block, so this is the only gap between them.
const LINE_H = 1.2;
// sampling step: smaller = more boxes, more detail, slower. NOT a constant,
// because it is in buffer units and draw() multiplies everything by `fit` —
// so a cube lands on screen at RES * 0.9 * fit px, which scales linearly with
// the canvas width. at 1024px that is ~5.6px, but by 320px it is under 2px and
// the rasteriser starts missing cubes altogether: the face thins out and fades
// instead of simply getting smaller. so retune RES on resize to hold the cube
// size roughly constant, trading detail (fewer, chunkier cubes) for a face
// that stays solid. RES_MIN is the old fixed value, so wide screens are
// unchanged.
let RES = 4;
// on-screen cube size to hold. deliberately set to what a WIDE screen already
// renders (RES_MIN against a height-limited fit of ~0.6), so the desktop look
// is bit-for-bit unchanged and only the narrow end, where cubes were falling
// under a pixel, actually moves.
const TARGET_BOX_PX = 3.6;
const RES_MIN = 5;
const RES_MAX = 24;

// pick the RES that puts a cube nearest TARGET_BOX_PX for a canvas this size.
// returns true if it changed, i.e. if the caller needs to resample.
function retuneRes(canvasW, canvasH) {
  const fit = Math.min(canvasW / ink.w, canvasH / ink.h) * FILL;
  if (!(fit > 0)) return false;
  const wanted = Math.min(
    RES_MAX,
    Math.max(RES_MIN, Math.round(TARGET_BOX_PX / fit)),
  );
  if (wanted === RES) return false;
  RES = wanted;
  return true;
}
const DEPTH = 70; // how far the letters extrude
// kaomoji glyphs don't exist in display faces like Bungee Spice, so the
// browser falls back per-glyph and the eyes end up a different size from
// the brackets. a plain ui font has the whole set and stays consistent.
const FONT_STACK =
  '-apple-system, "Poppins", "Segoe UI Symbol", "Apple Symbols", sans-serif';

// the face is always sampled into a buffer of this fixed size, so the box
// count depends only on how much ink the face has and never on the viewport.
// we then scale the whole drawing to fit whatever size the canvas happens
// to be. note the face is fitted to the buffer WIDTH (and, once it has more
// than one line, to its HEIGHT too), so a face with more glyphs or more lines
// is drawn smaller rather than wider — box count stays in the same ballpark
// across faces instead of growing with their length.
const BUF_W = 700;
const BUF_H = 700;

// --- the two size dials -----------------------------------------------------
//
// CANVAS_SCALE sizes the CANVAS relative to the div it lives in. 1 = exactly the
// div; above 1 the canvas is bigger than its box and the drawing spills past it,
// which works because the parent in FancyTop.tsx is overflow-visible.
//
// FILL sizes the FACE within that canvas. 1 = hard against the canvas edges. it
// is applied to a fit measured from the face's own ink bounds (see ink below),
// not from the buffer, so it means what it says.
//
// for "make the whole sketch bigger" reach for CANVAS_SCALE; for "make the face
// bigger in the space it already has" reach for FILL.
//
// FILL was 0.92, i.e. the face all but touched the canvas edges. the card
// panel (see PANEL_PAD) has to come out of that same canvas, so the face gave
// the difference back: 0.68 leaves the panel room to sit INSIDE the canvas
// instead of spilling down over the About section. to get the old face size
// back without losing the card, grow the box rather than the face — raise
// --sketch-height in index.css, or CANVAS_SCALE above; both scale face and
// panel together.
const CANVAS_SCALE = 1.1;
const FILL = 1.0; //0.68 original

// gap between the face and the edge of the card behind it, as a fraction of
// the face's on-screen HEIGHT. one number for all four sides rather than a
// fraction per axis, because these faces are far wider than they are tall and
// a percentage-of-width padding would read as a huge left/right margin next to
// a thin top/bottom one.
//
// it multiplies up with FILL: the panel ends up FILL * (1 + 2 * PANEL_PAD) of
// the canvas on whichever axis the face was fitted to, so 0.68 * 1.4 = 0.95 —
// just inside. push PANEL_PAD past ~0.23 and the panel starts to overflow the
// canvas (which is allowed to spill, so it will sit over whatever is below).
const PANEL_PAD = 0.2;

// --- sparkle ---------------------------------------------------------------
// tiny white cubes that pop into existence ON TOP of the face, swell, and
// vanish. they are their own geometry drawn in a second pass after the letters,
// not the letter-cubes restyled — which is what lets them be pure white and a
// fraction of a cube in size, independent of whatever the face is doing.
//
// white, literally 255, and emissive rather than lit. an emissive material is
// self-lit: it ignores the orbiting key light entirely, so a sparkle reads at
// full brightness no matter which way the slab happens to be facing at that
// moment. a normal material would be shaded along with everything else and the
// glints would dim and brighten with the light instead of twinkling on their
// own.
//
//   SPAWN  new sparkles per frame, on average. fractional on purpose — 0.6 at
//          50fps is roughly one every other frame. push it past ~3 and the face
//          stops twinkling and starts strobing.
//   LIFE   how many frames one lasts, start to finish. longer reads as a slow
//          shimmer, shorter as a camera flash.
//   SIZE   cube size at the peak, as a fraction of a letter-cube. this is the
//          "tiny" dial — at 0.45 a sparkle is under half a letter cube, so it
//          sits on the face as a speck rather than a lump. the scale animation
//          runs from 0 up to this and back, so they grow out of nothing.
//   FRONT  how far in front of the slab they sit, in letter-cube units. the
//          letters are RES*2 deep and centred on z=0, so their front face is at
//          +RES — anything less than 1 here buries the sparkles inside them.
const SPARKLE_SPAWN = 0.3;
const SPARKLE_LIFE = 80;
const SPARKLE_SIZE = 0.4;
const SPARKLE_FRONT = 1;

let cells = [];
// the sparkles currently alive: {x, y, end}. a short list rather than a flag
// per cell, because there are only ever a handful of these against thousands of
// cells, and the second pass should cost the handful and not the thousands.
// the POSITION is copied at spawn time, not the cell index — cells get rebuilt
// whenever RES retunes or the theme swaps the face, and an index would then
// point at a different cube (or off the end). buffer-centred coordinates stay
// meaningful across all of that.
let sparkles = [];
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

// --sketch-face is a sequence of quoted strings, one per line:
//   --sketch-face: "✦ ⋆ ✦" "ʕ•ᴥ•ʔ" "✦ ⋆ ✦";
// the quotes are what keep a paren or semicolon in a face from breaking css
// parsing, and they're also what separates the lines — so each line gets its
// own pair. a single unquoted value still works and reads as one line.
// returns true if the face actually changed, since resampling costs a
// full-buffer pixel readback and only the face affects it.
function readFace() {
  const cs = getComputedStyle(document.documentElement);
  const raw = cs.getPropertyValue("--sketch-face").trim();

  const next = [];
  const quoted = /"([^"]*)"|'([^']*)'/g;
  let m;
  while ((m = quoted.exec(raw)) !== null) {
    const line = m[1] !== undefined ? m[1] : m[2];
    if (line.trim()) next.push(line);
  }
  if (!next.length && raw) next.push(raw);

  const face = next.length ? next : FALLBACK_TEXT;
  // cheap identity check — lines never contain a newline
  if (face.join("\n") === lines.join("\n")) return false;
  lines = face;
  return true;
}

function s1(p) {
  p.preload = function () {};

  // measure the div the sketch lives in, so the canvas follows the layout.
  // that div is #topSketch in FancyTop.tsx: absolute inset-0 w-full h-6/10
  // inside a h-dvh mt-20 max-w-2xl lg:max-w-5xl column — so width is that
  // column (672px, 1024px from lg, viewport width below that) and height is
  // 60% of the viewport. CANVAS_SCALE then oversizes the canvas against it.
  function hostSize() {
    const host = document.getElementById("topSketch");
    const w = host && host.clientWidth ? host.clientWidth : p.windowWidth;
    const h =
      host && host.clientHeight ? host.clientHeight : p.windowHeight * 0.6;

    // CANVAS_SCALE deliberately oversizes the canvas past its box so the
    // drawing can spill, and the hero is overflow-visible to let it. but
    // nothing capped that spill against the VIEWPORT, so on a phone the
    // canvas came out wider than the screen and the page panned sideways.
    // documentElement.clientWidth, not windowWidth: the latter is
    // window.innerWidth, which includes the scrollbar and would hand back a
    // cap that is itself slightly too wide.
    const viewport = document.documentElement.clientWidth || p.windowWidth;
    const capped = Math.min(w * CANVAS_SCALE, viewport);
    // scale height by whatever the width actually got rather than by
    // CANVAS_SCALE, or capping the width alone would stretch the face
    return { w: capped, h: h * (capped / w) };
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

    // scale type so the face always fills the buffer: size it off the widest
    // line, then give that size back up if the stack of lines would be taller
    // than the buffer — anything past the edge is simply never sampled.
    const BASE = 280;
    gfx.textSize(BASE);
    let widest = 0;
    for (let i = 0; i < lines.length; i++) {
      widest = Math.max(widest, gfx.textWidth(lines[i]));
    }
    const byWidth = widest > 0 ? BASE * ((w * 0.9) / widest) : BASE;
    const byHeight = (h * 0.9) / (lines.length * LINE_H);
    const size = Math.min(byWidth, byHeight);
    gfx.textSize(size);

    // textAlign is CENTER/CENTER, so each line is placed by its own middle
    const step = size * LINE_H;
    const firstY = h / 2 - ((lines.length - 1) / 2) * step;
    for (let i = 0; i < lines.length; i++) {
      gfx.text(lines[i], w / 2, firstY + i * step);
    }

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

  // size the card behind the face (#sketchPanel in FancyTop.tsx) to the face's
  // on-screen bounds. it lives in the dom rather than being drawn into the
  // canvas because webgl has no stroked rectangle worth the name, and this way
  // the card picks up --color-canvas / --color-line / --shadow-hard straight
  // from the theme, exactly like a project card does.
  //
  // this runs on resize and on resample, NOT per frame — it writes to style,
  // which costs a layout, and nothing about the face's footprint changes
  // between frames (the animation is in the box DEPTH and the light, both of
  // which stay inside these bounds).
  function layoutPanel() {
    const el = document.getElementById("sketchPanel");
    if (!el) return;
    // no cells yet means nothing has been sampled, so there is no face to sit
    // behind — leave the panel at zero rather than drawing an empty box
    if (!cells.length) {
      el.style.width = "0px";
      el.style.height = "0px";
      return;
    }
    // the same fit draw() uses, so the panel tracks the face exactly. the
    // rotateX/rotateY tilt is ignored: at 0.18/0.14 rad it shaves under 2% off
    // the projected size, which the padding swallows.
    const fit = Math.min(p.width / ink.w, p.height / ink.h) * FILL;
    const faceW = ink.w * fit;
    const faceH = ink.h * fit;
    const pad = faceH * PANEL_PAD;
    el.style.width = Math.round(faceW + pad * 2) + "px";
    el.style.height = Math.round(faceH + pad * 2) + "px";
  }

  p.setup = function () {
    const { w, h } = hostSize();
    canvas1 = p.createCanvas(w, h, p.WEBGL).parent("#topSketch");
    canvas1.style("display", "flex");
    // the panel is absolutely positioned and the canvas is not, so by default
    // the panel paints OVER it and hides the face completely. giving the canvas
    // a position and a z-index puts it back on top.
    canvas1.style("position", "relative");
    canvas1.style("z-index", "1");
    p.pixelDensity(1);

    readPalette();
    readFace();
    // the theme toggle flips data-theme on <html>: recolour always, and
    // resample the boxes only when that theme's face differs from the one
    // already on screen.
    new MutationObserver(function () {
      readPalette();
      // a new face has new ink bounds, so the card has to be remeasured with it
      if (readFace()) {
        buildCells();
        layoutPanel();
      }
    }).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // twice on purpose: retuneRes needs the ink bounds to know the display
    // scale, and only buildCells can measure them. so sample once at RES_MIN
    // to get ink, then resample if that scale wants a coarser step — which it
    // does whenever the page loads already narrow, rather than being resized
    // down to narrow later.
    buildCells();
    const first = hostSize();
    if (retuneRes(first.w, first.h)) buildCells();
    layoutPanel();

    // google fonts may still be loading on first paint, so resample
    // once they're ready or the text falls back to plain sans-serif
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        buildCells();
        layoutPanel();
      });
    }
  };

  // follow the layout when the window changes. mostly only the scale factor in
  // draw() changes, but a big enough change moves RES to a new bucket, and then
  // the cells do have to be rebuilt — retuneRes only says so when it actually
  // changed, so a drag across one bucket costs a single resample, not one per
  // resize event.
  p.windowResized = function () {
    const { w, h } = hostSize();
    p.resizeCanvas(w, h);
    if (retuneRes(w, h)) buildCells();
    // unconditional, unlike the resample: the fit scale changes on every
    // resize, bucket change or not, so the card moves with every one of them
    layoutPanel();
  };

  p.draw = function () {
    // clear() wipes to transparent so the page shows through. without it
    // webgl keeps every previous frame, so the word drawn in the fallback
    // font stays burned in after the real font loads and cells rebuild.
    p.clear();

    // orthographic, not the default perspective camera — this is what fixes
    // the face sitting slightly LEFT of every other element on the page.
    // rotateY below tilts the slab, which under perspective sends +x away from
    // the camera and -x toward it. the near side is then magnified and the far
    // side shrunk, so the projected face is no longer symmetric about the
    // canvas centre even though the geometry is: it lands ~7px left. ortho has
    // no such falloff, so centred geometry projects centred.
    // the tilt still reads as depth because depth here comes from the
    // directional light catching the box tops and sides, not from perspective
    // convergence — see the rotateX/rotateY comment below.
    // set per frame rather than in setup(): resizeCanvas() restores the
    // default perspective projection, so windowResized would undo it.
    //
    // the near/far arguments are the fix for the face being sliced off along a
    // straight diagonal edge as the window narrowed. called bare, p5 defaults
    // them to near = 0 and far = max(width, height) — the clip planes are tied
    // to the CANVAS SIZE, which has nothing to do with how deep the geometry
    // actually is. the default camera sits at about 0.87 * height, so on a wide
    // canvas far (the width) comfortably clears it and nothing clips; as the
    // canvas narrows, far falls until the far plane lands in front of the
    // geometry and starts cutting through it. a flat slab tilted on two axes
    // intersects a plane along a straight line, and that line is the diagonal.
    // the rotateX/rotateY below make it worse the steeper they get, since the
    // tilt is what gives the slab any depth to be cut at all.
    //
    // so: same framing as the default (-w/2..w/2, -h/2..h/2, which is exactly
    // what p5 would have used), but a depth range big enough that it is never
    // the binding constraint. near is NEGATIVE on purpose — an orthographic
    // projection is a box, not a frustum, so there is no division by the near
    // distance and putting the plane behind the camera is legal; it just widens
    // the slab of space that gets drawn.
    const halfW = p.width / 2;
    const halfH = p.height / 2;
    p.ortho(-halfW, halfW, -halfH, halfH, -10000, 10000);

    p.push();

    // ambient is flat and directionless — it sets the SHADOW floor, the
    // darkest any face gets. keep it dark or the word goes flat.
    p.ambientLight(p.color(palette.ambient));

    // the key light is the only thing that differentiates faces, so it
    // provides all the shading. it orbits, so the highlight travels.
    const angle = p.frameCount * 0.01;
    const lx = 150 * Math.cos(angle);
    const ly = 200 * Math.sin(angle);
    const lz = 100 * Math.sin(angle * 0.1);
    p.directionalLight(p.color(palette.key), p.createVector(lx, ly, lz));

    // seen straight on, every box shows only its +z face — all normals
    // identical, so no light can shade one differently from another. a
    // small fixed tilt exposes the tops and sides, and THAT is what reads
    // as depth. raise these for a more dramatic angle.
    p.rotateX(-0.6); // -0.18
    p.rotateY(0.4); // test to comment out! 0.14

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
        DEPTH * (0.6 + 0.4 * Math.sin(p.frameCount * 0.01 + c.x * 0.02)) * 0.05;
      mouseD;
      p.push();
      p.translate(c.x, c.y);
      // p.box(RES * 0.9, RES * 0.9, d);
      p.box(RES * 0.9, RES * 0.9, RES * 2);

      p.pop();
    }

    // --- the sparkles, a second pass over the finished face -----------------
    // spawn first. the loop shape is what lets SPAWN be fractional: a whole
    // number places that many, and the leftover fraction is the chance of one
    // more. the position is lifted from a random CELL rather than from anywhere
    // in the box, so sparkles only ever land on the ink — on the face itself,
    // never floating in the empty space around it.
    let toSpawn = SPARKLE_SPAWN;
    while (cells.length > 0 && toSpawn > 0) {
      if (toSpawn < 1 && Math.random() > toSpawn) break;
      const c = cells[(Math.random() * cells.length) | 0];
      sparkles.push({ x: c.x, y: c.y, end: p.frameCount + SPARKLE_LIFE });
      toSpawn -= 1;
    }

    if (sparkles.length) {
      // emissive = self-lit. the box ignores the orbiting key light and comes
      // out flat 255 white whichever way the slab is turned.
      p.emissiveMaterial(255, 255, 255);

      // draw and prune in one pass: survivors are written back over the front
      // of the array and the length is trimmed at the end, so no garbage is
      // allocated per frame the way filter() would.
      let kept = 0;
      for (let i = 0; i < sparkles.length; i++) {
        const s = sparkles[i];
        const left = s.end - p.frameCount;
        if (left <= 0) continue;
        sparkles[kept++] = s;

        // 0 -> 1 -> 0 across its life. sin, so it grows out of nothing and
        // shrinks back to nothing; a plain countdown would have each speck
        // appear full-size and only taper, which reads as a glitch.
        const pulse = Math.sin((left / SPARKLE_LIFE) * Math.PI);
        const size = RES * SPARKLE_SIZE * pulse;

        p.push();
        // the z is what puts them ON TOP: the letter cubes are RES*2 deep and
        // centred on z=0, so this clears their front face
        p.translate(s.x, s.y, RES * SPARKLE_FRONT);
        p.box(size);
        p.pop();
      }
      sparkles.length = kept;

      // emissive is sketch-wide state and push/pop does not scope it, so
      // without this the whole face would render self-lit white next frame
      p.emissiveMaterial(0, 0, 0);
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
