import type { ProjectType } from "../types/Types";
import Carousel from "./Carousel";

type BigCardProps = {
  project: ProjectType;
};

export default function BigCard({project}: BigCardProps) {
  // square corners + the hard offset shadow, same as the Card it opens from.
  // shadow-hard is the --shadow-hard token, so it recolours per theme instead
  // of the soft grey shadow-md was painting.
  // w-full on the root below, filling the wrapper in Modal.tsx, which is now
  // where the overlay's width is decided. it used to be max-w-lg /
  // md:max-w-11/12 — 91.67% of a parent that was itself shrink-to-fit, so it
  // was a percentage of the prose length. one owner for the width is the point.
  return (
    <div className="mx-auto cursor-default w-full rounded-none bg-surface shadow-hard z-2"
        style={{
        background: "var(--color-canvas)",
        border:"1px solid",
      }}
    >
      <div className="lg:flex max-h-200 md:min-h-[600px]">
        {/* lg:min-w-0 cancels the 600px floor exactly where the flex split
            takes over. the floor is still wanted below lg, where this row is
            display:block and the column is just a full-width band that needs a
            sane minimum — but inside the flex row it fights the fixed basis on
            the text column beside it: 600 + 26rem + margins needs ~1112px,
            which a 1024px screen cannot give, and the two together overflowed
            the card. min-w-0 lets this column take whatever is left instead. */}
        <div className="flex-grow flex items-center justify-center min-w-[300px] md:min-w-[600px] lg:min-w-0">
          <Carousel images={project.images} id={["1234","4321","4331"]}/>
        </div>
        {/* extra bottom margin only on narrow screens: there the text column is
            the last thing in the card, so m-12 alone leaves it sitting too
            close to the bottom edge. from md up the layout is roomy already.

            lg:basis-2/5 with grow-0 shrink-0 is what makes the image a
            consistent size across projects. this column had NO flex utilities,
            which means flex: 0 1 auto — and an `auto` basis resolves to
            max-content, i.e. the whole description on a single line. with two
            shrinkable items the image column settles at roughly
            container * base_image / (base_image + base_text), so every extra
            sentence of prose was quietly squeezing the picture. the
            descriptions here run from ~300 to ~900 characters, which is why the
            images looked so unalike.
            a fixed basis takes the prose out of the maths entirely: the text
            column is 40% of the row whatever it says, and the image gets the
            rest. tune the 2/5 to move the split. */}
        <div className="flex m-12 mb-20 md:mb-12 flex-col justify-center lg:basis-2/5 lg:grow-0 lg:shrink-0">
          <h2 className="text-5xl border-b-2 border-line w-fit font-semibold mb-4">
            {project.title}
          </h2>
          {/* overflow-y-auto, not -scroll: -scroll paints an empty scrollbar
              gutter on short descriptions that don't actually overflow. */}
          {/* text-ink at 75%, not text-muted: this is the long version of the
              short_description on the list card (Card.tsx), and that one is
              `text-ink opacity-75` — so clicking through to the overlay no
              longer changes the colour of the text you were just reading.
              the two are NOT the same value: --color-muted is its own grey per
              theme, while ink-at-75 is the page's text colour let down toward
              whatever the card is sitting on, which is what keeps the pair
              consistent across all four themes rather than only by luck. */}
          <p className="max-mt-4 mb-10 overflow-y-auto text-balance text-ink opacity-75 max-h-80">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
}