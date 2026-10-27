// a test stand-in for CornerCube: the same corner box, but holding a gif
// instead of hosting the p5 sketch.
//
// the swap is one line in App.tsx — render <CornerGif /> or <CornerCube />.
// nothing else has to change: sketch/cornerCube.js only starts itself if it
// finds a div with id "cornerCube" (see the guard at the bottom of that file),
// so with this component in place the sketch sits out the render instead of
// drawing over the gif. note the deliberate lack of that id here — adding it
// would wake the sketch back up and parent a canvas on top of the image.
//
// the position and size are copied from CornerCube so the two land in exactly
// the same spot: fixed bottom-10 right-10, h-30 w-30, z-4 to clear main's z-2.
export default function CornerGif() {
  return (
    <div className="fixed bottom-10 right-10 z-4 h-30 w-30">
      <img
        src="/images/UntitledArtwork1.gif"
        alt=""
        aria-hidden="true"
        // the project thumbnails' tint, on the gif's own colours rather than
        // on greyscale — no grayscale/sepia in front, so the hue-rotate moves
        // what the artwork already has instead of replacing it. it runs on
        // the two theme dials in index.css, --tint-hue and --tint-strength,
        // which means changing the site tint moves this with it: there is no
        // second colour to keep in sync.
        //
        //   opacity-95    a touch of the page showing through, so it sits in
        //                 the corner rather than on top of it
        //   contrast-90   eased off slightly — the gif is high contrast on
        //                 its own and goes harsh at full
        //   brightness    lifts it. 100 is the gif as drawn, each step up is
        //                 +10%; it multiplies, so it opens the midtones up
        //                 and will clip the brightest pixels to flat white
        //                 somewhere past ~140
        //   hue-rotate    --tint-hue. no sepia in front, so unlike Card.tsx
        //                 this is measured from the gif's own colours, not
        //                 from sepia's ~40deg warm — 0deg is it untouched
        //   saturate      --tint-strength, how loud it is
        //
        // the duotone below is ONE arbitrary-property class, not five filter
        // utilities, and it has to be. tailwind composes its filter utilities
        // in a fixed alphabetical order — grayscale, hue-rotate, saturate,
        // sepia — no matter what order they are typed in, so `sepia` always
        // lands AFTER `hue-rotate` and flattens the rotated colour straight
        // back to brown. the chain only works written out in sequence, which
        // is the same reason Card.tsx builds its one by hand.
        //
        // note the underscores: tailwind reads a space inside [] as the end
        // of the class, so they stand in for the spaces between functions.
        // and parens cannot be used as a shorthand for [] here —
        // `hue-rotate(var(--frog-tint-hue))` is not a utility at all, so
        // tailwind emits nothing for it and the tint silently disappears.
        //
        // object-contain so the gif's own aspect ratio survives the square
        // box, the way the cube is drawn to the smaller side of it.
        //className="h-full w-full opacity-90 object-contain contrast-80 brightness-230 hue-rotate-[var(--frog-tint-hue)] saturate-[var(--frog-tint-strength)]"
        className="h-full w-full object-contain [filter:brightness(1.99)_grayscale(1)_sepia(1)_hue-rotate(var(--frog-tint-hue))_saturate(var(--frog-tint-strength))_contrast(0.8)]"

      />
    </div>
  );
}
