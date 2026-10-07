import type { ProjectType } from "../types/Types";
import Carousel from "./Carousel";

type BigCardProps = {
  project: ProjectType;
};

export default function BigCard({project}: BigCardProps) {
  // square corners + the hard offset shadow, same as the Card it opens from.
  // shadow-hard is the --shadow-hard token, so it recolours per theme instead
  // of the soft grey shadow-md was painting.
  return (
    <div className="mx-auto cursor-default max-w-lg rounded-none bg-surface shadow-hard md:max-w-11/12 z-2"
        style={{
        background: "var(--color-canvas)",
        border:"1px solid",
      }}
    >
      <div className="lg:flex max-h-200 md:min-h-[600px]">
        <div className="flex-grow flex items-center justify-center min-w-[300px] md:min-w-[600px]">
          <Carousel images={project.images} id={["1234","4321","4331"]}/>
        </div>
        {/* extra bottom margin only on narrow screens: there the text column is
            the last thing in the card, so m-12 alone leaves it sitting too
            close to the bottom edge. from md up the layout is roomy already. */}
        <div className="flex m-12 mb-20 md:mb-12 flex-col justify-center">
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