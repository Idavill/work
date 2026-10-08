// a small cube in the bottom-right corner, where the theme toggle used to sit.
// it turns slowly on its own, and clicking it adds a full twist about the y
// axis that eases to a stop.
//
// same shape as the other sketches in here: a plain script loaded from
// index.html, parented to a div that react renders (CornerCube.tsx). it reads
// its colours from the css theme tokens, so it repaints with the rest of the
// site.

// --- the dials -------------------------------------------------------------
//   SIZE     cube edge, as a fraction of the smaller side of its box. kept
//            under 1/sqrt(3) (~0.577) on purpose: a cube's longest diagonal is
//            sqrt(3) times its edge, and that corner is what swings closest to
//            the canvas edge mid-rotation. above that it clips at the corners
//            of the turn, which looks like a rendering bug rather than a crop.
//   SPIN_X   idle rotation per frame about x. small, so it drifts.
//   SPIN_Y   idle rotation per frame about y.
//   TWIST    radians added per click. TWO_PI is exactly one turn, so the cube
//            lands back where it started and the twist reads as a flourish
//            rather than as a change of pose.
//   EASE     how fast the twist catches up to its target each frame, 0..1.
//            lower is slower and more elastic-looking; 1 would teleport.
const SIZE = 0.5;
const SPIN_X = 0.006;
const SPIN_Y = 0.011;
const TWIST = Math.PI * 2;
const EASE = 0.08;

// the id of the div in CornerCube.tsx that this canvas is parented to
const HOST_ID = "cornerCube";

const corner_cube = function (p) {
  let palette = {
    material: "#ffffff",
    ambient: "#2e2e2e",
    key: "#ffffff",
  };

  // the twist is two numbers, not one. `target` is where the cube has been
  // asked to get to and only ever grows, by a whole turn per click; `angle`
  // chases it. that split is what makes rapid clicks feel right — each one
  // adds another turn to the queue instead of restarting the animation, so
  // the cube keeps accelerating rather than stuttering back to the start.
  let twistTarget = 0;
  let twistAngle = 0;

  function readPalette() {
    const cs = getComputedStyle(document.documentElement);
    const pick = (name, fallback) =>
      cs.getPropertyValue(name).trim() || fallback;
    palette = {
      material: pick("--color-sketch-material", "#ffffff"),
      ambient: pick("--color-sketch-ambient", "#2e2e2e"),
      key: pick("--color-sketch-key", "#ffffff"),
    };
  }

  // --- the face --------------------------------------------------------
  // the smiley is a TEXTURE, not geometry. one square drawing is painted onto
  // the cube and p5 wraps it round all six sides, so there is a face looking
  // at you whichever way the cube has turned — eyes built out of spheres would
  // live on one side only and spend most of the spin hidden round the back.
  //
  // it is drawn once into an offscreen 2d buffer and reused every frame.
  //
  // the face is a STRING, so changing it is typing a new one — no coordinates
  // to nudge. it comes from --cube-face in index.css, right beside the hero's
  // --sketch-face, and falls back to the constant below if a theme sets none.
  // quote it in css: a bare value containing a paren or a semicolon breaks css
  // parsing for the whole block, and most kaomoji contain both.
  //
  // FACE_PX is the buffer's resolution: nothing to do with how big the cube is
  // on screen, only how crisp the glyphs look. FACE_FILL is how much of that
  // square the text takes up — the type is auto-scaled to it, so a long face
  // comes out smaller rather than running off the edge.
  const FACE_PX = 128;
  const FACE_FILL = 0.72;
  const CUBE_FACE_FALLBACK = "●‿●";
  // deliberately a plain ui font and NOT a display face: kaomoji glyphs are
  // missing from decorative fonts, so the browser substitutes per character
  // and the eyes end up a different size from the brackets. named CUBE_FONT
  // rather than FONT_STACK because these sketches are classic scripts sharing
  // one global scope — topSketch.js already has a top-level FONT_STACK, and a
  // second const of that name would throw before anything ran.
  const CUBE_FONT =
    '-apple-system, "Poppins", "Segoe UI Symbol", "Apple Symbols", sans-serif';
  let faceTex;

  function readCubeFace() {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--cube-face")
      .trim();
    // css hands the value back with its quotes still attached, so strip one
    // matching pair; an unquoted value is passed through as-is
    const quoted = raw.match(/^"(.*)"$|^'(.*)'$/);
    const face = quoted ? (quoted[1] ?? quoted[2]) : raw;
    return face || CUBE_FACE_FALLBACK;
  }

  // the features need to contrast with whatever --color-sketch-material the
  // theme picked, and no single colour does that across all of them: material
  // is near-white on mono and a mid slate on paper. so pick by luminance —
  // dark ink on a light cube, light ink on a dark one. the 0.299/0.587/0.114
  // weights are the standard perceptual ones; green dominates because the eye
  // is most sensitive to it.
  function inkFor(hex) {
    const c = p.color(hex);
    const lum = 0.299 * p.red(c) + 0.587 * p.green(c) + 0.114 * p.blue(c);
    return lum > 140 ? "#141414" : "#ffffff";
  }

  function buildFace() {
    if (!faceTex) faceTex = p.createGraphics(FACE_PX, FACE_PX);
    const g = faceTex;
    const face = readCubeFace();

    // the buffer is opaque: it IS the cube's surface, so the background here
    // is what the body of the cube is made of
    g.background(palette.material);

    g.noStroke();
    g.fill(inkFor(palette.material));
    g.textFont(CUBE_FONT);
    g.textAlign(g.CENTER, g.CENTER);

    // auto-fit, so any string works without touching a number. measure at an
    // arbitrary base size, then scale by how far off the target width it came
    // out. the second term caps it by HEIGHT — a one or two character face is
    // not width-limited at all, and without the cap it would be scaled up
    // until it overflowed the square vertically.
    const BASE = 64;
    g.textSize(BASE);
    const measured = g.textWidth(face);
    const target = FACE_PX * FACE_FILL;
    g.textSize(
      measured > 0 ? Math.min((BASE * target) / measured, target) : BASE,
    );

    g.text(face, FACE_PX / 2, FACE_PX / 2);
  }

  function hostSize() {
    const host = document.getElementById(HOST_ID);
    // the fallback matches the h-20 w-20 on the div, so a canvas built before
    // layout settles is still the right size rather than p5's 100x100 default.
    // keep it in step if that class changes.
    const w = host && host.clientWidth ? host.clientWidth : 80;
    const h = host && host.clientHeight ? host.clientHeight : 80;
    return { w, h };
  }

  p.setup = function () {
    const { w, h } = hostSize();
    const c = p.createCanvas(w, h, p.WEBGL).parent(HOST_ID);

    readPalette();
    buildFace();
    // repaint the face too, not just the palette — the texture has the
    // material colour baked into it, so a theme change that only reran
    // readPalette would leave the cube wearing the old theme's skin
    new MutationObserver(function () {
      readPalette();
      buildFace();
    }).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // p5's own canvas-level handler rather than a react onClick on the wrapper
    // or a window event: the canvas fills the div and is the only thing in it,
    // so there is nothing to coordinate between the two sides. if the click
    // ever needs to drive something in react as well, dispatch a CustomEvent
    // from here — that is how ThemeToggle talks to background_sketch.js.
    c.mousePressed(function () {
      twistTarget += TWIST;
    });
  };

  p.windowResized = function () {
    const { w, h } = hostSize();
    p.resizeCanvas(w, h);
  };

  p.draw = function () {
    // transparent, so the page shows through around the cube
    p.clear();

    // orthographic with an EXPLICIT depth range. called bare, p5 defaults near
    // to 0 and far to max(width, height) — on a 56px canvas that is a 56-unit
    // deep slice sitting well in front of the default camera, and the cube is
    // simply never inside it. the same defaulting is what used to slice the
    // hero face diagonally on narrow screens; see the note in topSketch.js.
    p.ortho(-p.width / 2, p.width / 2, -p.height / 2, p.height / 2, -500, 500);

    p.ambientLight(p.color(palette.ambient));
    // a fixed light, unlike the orbiting one in topSketch: here the CUBE is
    // what moves, so a still light is what makes the faces change value as it
    // turns. move both and the shading muddies into a shimmer.
    p.directionalLight(p.color(palette.key), p.createVector(-0.6, 0.5, -1));

    // ease the twist toward its target. the gap shrinks by EASE each frame, so
    // it decelerates on its own and never quite arrives — snapping the last
    // fraction keeps the two from drifting apart over many clicks and stops
    // the idle spin below from carrying a stale remainder forever.
    twistAngle += (twistTarget - twistAngle) * EASE;
    if (Math.abs(twistTarget - twistAngle) < 0.001) twistAngle = twistTarget;

    p.rotateX(p.frameCount * SPIN_X);
    p.rotateY(p.frameCount * SPIN_Y + twistAngle);

    p.noStroke();
    // texture() replaces fill/ambientMaterial as the surface — setting those
    // as well does nothing here, since the texture wins. the lights above
    // still apply: p5 shades textured geometry, which is what keeps the cube
    // reading as a solid object rather than a flat sticker.
    p.texture(faceTex);

    p.box(Math.min(p.width, p.height) * SIZE);
  };
};

// react mounts after this script runs, so the host div does not exist yet.
// starting p5 early means .parent() finds nothing and the canvas is appended
// to the end of <body> instead — a stray square below the footer.
function startCornerCube() {
  if (document.getElementById(HOST_ID)) {
    new p5(corner_cube);
  } else {
    requestAnimationFrame(startCornerCube);
  }
}
startCornerCube();
