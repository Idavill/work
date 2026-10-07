// Noise tends to look smoother with coordinates that are very close together
// These values will be multiplied by the x and y coordinates to make the

// const { read } = require("fs");

// resulting values very close together
let xScale = 0.02;
let yScale = 0.004;

let gap;
let offset;

// --- film grain --------------------------------------------------------
// texture over the whole backdrop. drawn here rather than as a css layer
// because this canvas is already fixed, already full-viewport and already
// repainting every frame — so the grain costs one blit on top of work that
// was happening anyway, and it lands in exactly the right place in the
// stack: above the page background, below the cards.
//
// the method matters for speed. generating noise per pixel per frame over a
// full screen is ~1.3M writes at 50fps and would melt a laptop. instead a
// few small tiles are generated ONCE and stamped across the canvas. pure
// per-pixel random has no structure, so there is nothing for the eye to
// latch onto at the tile edges and the repeat is invisible — this trick
// only fails for structured noise like perlin, which does show seams.
//
// the dials:
//   GRAIN_ALPHA   strength, 0-255. the first one to reach for. 18 is a
//                 whisper; past ~40 it stops being texture and becomes a
//                 visible dither.
//   GRAIN_TILE    tile size. bigger = fewer blits per frame but more memory
//                 and a longer one-off build. it does NOT change how the
//                 grain looks, only how it is delivered.
//   GRAIN_FRAMES  how many tiles get cycled. 1 freezes the grain into a
//                 static film over the page; 3+ gives it the shimmer of
//                 film. this is the knob with a real aesthetic difference.
//   GRAIN_EVERY   frames between swaps. raise it to slow the shimmer down.
const GRAIN_TILE = 256;
const GRAIN_ALPHA = 18;
const GRAIN_FRAMES = 1;
const GRAIN_EVERY = 2;

// --- the shake ---------------------------------------------------------
// easter egg: the corner button in ThemeToggle.tsx fires a window event and
// the dot grid ripples, then settles. a window CustomEvent and not a prop or
// a context, because this file is a plain script loaded from index.html — it
// runs outside react entirely and has no way to be handed state. the event is
// the only seam the two already share, and it stays one-way: react shouts,
// the sketch listens, neither imports the other.
const SHAKE_EVENT = "background:shake";
// multiplied in per frame, so it MUST stay below 1 — it is a decay rate, not
// a duration. at 1 the shake never ends; above 1 it grows 1.2x a frame into
// the thousands within a second, which used to hang the tab outright (gap
// went negative and the x loop counted away from its own exit condition
// forever). the clamp in dotGrid now catches that, but the value is still
// nonsense above 1.
//   0.90  a quick snap, about a third of a second
//   0.965 roughly a second          <- default
//   0.985 a long slow swell, about three seconds
// for a LONGER shake, move it closer to 1, never past it.
const SHAKE_DECAY = 0.9;
// what the shake does to the noise field at full strength. these are the
// character of it — the field is sampled on a grid, so stretching the sample
// scale is what makes the pattern surge and swim rather than just move.
//   X/Y_SCALE  how far the noise field is stretched. Y is the dramatic one:
//              yScale is tiny (0.004) so the grid normally reads as near
//              horizontal bands, and pushing it is what breaks them up.
//   BLOOM      how much taller a dot gets at the peak, added to its resting
//              0.08 flatness. THIS is the ripple now: each cell swells on its
//              own y axis and the grid itself never moves.
//   WAVE       how tight the vertical wave is, in radians per pixel. the
//              bloom is phased by each cell's y, so the swell travels down
//              the page instead of every dot puffing at once. 0.012 is about
//              one full wave per 520px. set to 0 for a flat, all-at-once
//              pulse.
//   WAVE_SPEED how fast that wave travels. negative sends it upward.
//   SPEED      extra travel through the noise's third axis per frame, i.e.
//              how fast the pattern churns while shaken.
//
// there is deliberately no gap dial any more. animating the grid spacing was
// what made the effect look like it came from the top-left corner: gap is the
// step of both loops below AND their start offset, so changing it re-lays the
// whole grid from the origin and the pattern slides cornerward. the dots now
// stay exactly where they are and only their height moves.
const SHAKE_X_SCALE = 1;
const SHAKE_Y_SCALE = 1;
const SHAKE_BLOOM = 0.006;
const SHAKE_WAVE = 0.00012;
const SHAKE_WAVE_SPEED = 0.001;
const SHAKE_SPEED = 0.000006;

const background_sketch = function (p) {
  let palette;
  let currentFill;
  let targetFill;
  let scrollSmooth = 0;
  const FADE = 0.1;
  const SCROLL_EASE = 0.1;
  let grainTiles = [];
  let grainIndex = 0;
  // 1 the instant the button is hit, decaying toward 0 every frame
  let shake = 0;
  // how far the noise field has been carried by past shakes. kept separately
  // from frameCount so the churn SPEEDS UP during a shake and then holds its
  // new position — winding the clock forward rather than snapping it back,
  // which would make the pattern jump at the end of every ripple.
  let shakeTime = 0;

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
    buildGrain();
    currentFill = targetFill;
    scrollSmooth = window.scrollY;

    new MutationObserver(readPalette).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // this is a decorative motion effect over the whole page, so it is exactly
    // the kind of thing prefers-reduced-motion exists for. checked at click
    // time rather than cached at setup, since the OS setting can change while
    // the tab is open. the button still works, it just doesn't move anything.
    const stillness = window.matchMedia("(prefers-reduced-motion: reduce)");
    window.addEventListener(SHAKE_EVENT, function () {
      if (stillness.matches) return;
      // = 1, not += 1: a rapid second click restarts the ripple at full
      // strength instead of stacking into something seasick
      shake = 1;
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

  // one-off: fill each tile with per-pixel greyscale noise at a fixed low
  // alpha. writing straight into the pixels array rather than drawing points
  // is what keeps this to a few milliseconds — point() would be one draw call
  // per pixel, 65k of them per tile.
  function buildGrain() {
    grainTiles = [];
    for (let i = 0; i < GRAIN_FRAMES; i++) {
      const g = p.createGraphics(GRAIN_TILE, GRAIN_TILE);
      g.pixelDensity(1); // or the pixels array is 4x longer than the tile
      g.loadPixels();
      for (let j = 0; j < g.pixels.length; j += 4) {
        const v = Math.random() * 255;
        g.pixels[j] = v;
        g.pixels[j + 1] = v;
        g.pixels[j + 2] = v;
        g.pixels[j + 3] = GRAIN_ALPHA;
      }
      g.updatePixels();
      grainTiles.push(g);
    }
  }

  function drawGrain() {
    if (!grainTiles.length) return;
    // swapping which tile is stamped is what animates the grain. the whole
    // screen changes to the same new tile at once, which is fine — grain has
    // no shape, so there is nothing to read as a pattern sliding about.
    if (p.frameCount % GRAIN_EVERY === 0) {
      grainIndex = (grainIndex + 1) % grainTiles.length;
    }
    const g = grainTiles[grainIndex];
    for (let x = 0; x < p.width; x += GRAIN_TILE) {
      for (let y = 0; y < p.height; y += GRAIN_TILE) {
        p.image(g, x, y);
      }
    }
  }

  p.draw = function () {
    dotGrid();
    // after dotGrid, so the grain sits over the dots as well as the page —
    // dotGrid opens with clear(), so anything drawn before it is wiped
    drawGrain();
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

    // squared, so the ripple reads as a snap and a settle. the decay is
    // already exponential; squaring pulls the tail in further still, which
    // keeps the punch at the front and stops the last faint 20% dragging on
    // long enough to look like a bug rather than an effect.
    // clamped to 0..1 before anything reads it. the dials below are written as
    // "lerp from rest to the shaken value by s", which only means what it says
    // inside that range — outside it they extrapolate, and gap in particular
    // goes negative and turns the x loop into an infinite one that hangs the
    // page. a bad SHAKE_DECAY should look wrong, not lock the tab.
    const s = Math.min(1, Math.max(0, shake * shake));
    shakeTime += s * SHAKE_SPEED;

    // every one of these is the resting value when s is 0, so the whole
    // effect costs nothing at all once it has decayed away
    const xs = xScale * (1 + (SHAKE_X_SCALE - 1) * s);
    const ys = yScale * (1 + (SHAKE_Y_SCALE - 1) * s);

    // Get the current gap and offset values from the sliders
    // constant on purpose — see the SHAKE_BLOOM comment up top. gap is both
    // the step of the loops below and where they start, so animating it slides
    // the entire grid toward the origin.
    gap = 25; //gapSlider.value();
    offset = 1; //offsetSlider.value();

    scrollSmooth += (window.scrollY - scrollSmooth) * SCROLL_EASE;

    // the bloom is phased by y, so work it out once per ROW rather than once
    // per cell: there are ~36 rows against ~2000 cells, and it depends on
    // nothing else. index, not a lookup by y, because the rows are generated
    // by the same loop below and so line up one for one.
    const rowBloom = [];
    for (let y = gap / 2; y < p.height; y += gap) {
      // 0..1, so the bloom only ever adds height, never subtracts it — a
      // raw sin would pull half the rows BELOW their resting flatness and
      // the ripple would read as a flicker rather than a swell.
      const wave =
        SHAKE_WAVE > 0
          ? 0.5 + 0.5 * Math.sin(y * SHAKE_WAVE - shakeTime * SHAKE_WAVE_SPEED)
          : 1;
      rowBloom.push(0.08 + SHAKE_BLOOM * s * wave);
    }

    // Loop through x and y coordinates, at increments set by gap
    for (let x = gap / 2; x < p.width; x += gap) {
      let row = 0;
      for (let y = gap / 2; y < p.height; y += gap) {
        const flatness = rowBloom[row++];
        // Calculate noise value using scaled and offset coordinates
        let noiseValue = p.noise(
          (x + offset) * xs,
          (y + offset + scrollSmooth * 0.5) * ys,
          p.frameCount * 0.002 + shakeTime,
        );

        // Since noiseValue will be 0-1, multiply it by gap to set diameter to
        // between 0 and the size of the gap between circles
        if (noiseValue > 0.5) {
          let diameter = (noiseValue - 0.5) * 50 * gap;
          //   let diameter = 1 * gap;
          p.ellipse(x, y, diameter * 2, diameter * flatness);
        }
      }
    }

    // decay last, so the frame that the click lands on is drawn at full
    // strength. the floor stops it ticking along at 1e-17 forever.
    if (shake > 0) {
      shake *= SHAKE_DECAY;
      if (shake < 0.001) shake = 0;
    }
  }
};

new p5(background_sketch);
