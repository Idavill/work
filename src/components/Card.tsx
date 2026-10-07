import { useState } from "react";
import type { ProjectType } from "../types/Types";
import PaperTag from "./PaperTag";

type CardProps = {
  project: ProjectType
  open: Object | null;
  setOpen: (x: boolean) => void;
};

export default function Card({ project, setOpen }: CardProps) {
  const [hover,setHover] = useState(false);
  // text-ink at rest, text-card-accent on hover. card-accent and not the plain
  // accent the Button and the Carousel arrows use: a whole card lighting up is
  // far more colour than a nav label, so the two want separate dials. group-hover
  // rather than the `hover` state above, because the thing being hovered is
  // the CARD, not the paragraph — `group` on the card root is what lets a
  // child react to it. duration-600 matches the card's own bg transition, so
  // the wash and the text move together instead of in two stages.
  let color =
    "text-ink opacity-75 group-hover:text-card-accent group-hover:opacity-100 transition-colors duration-600"

  return (
      <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} key={project.id}
      className={`group flex mb-12 justify-center m-3 w-full border border-line cursor-pointer hover:bg-hover transition-colors duration-600 bg-canvas backdrop scroll-mt-30 mx-auto max-w-lg overflow-hidden rounded-none shadow-hard md:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl z-2`}
      onClick={() => setOpen(true)}
      >
      {/* w-full min-w-0: this is a flex item of the card above, and a flex
          item's default min-width:auto is min-content — so without these it
          sizes to its contents (the image is 656px intrinsic) and refuses to
          shrink to a phone. */}
      <div className="w-full min-w-0 md:flex">
        {/* the full image goes in the <img>, so animated projects animate here
            on the list and not only inside the modal. the -poster.webp sibling
            (frame 1, ~54KB) is painted behind it as a background, because the
            full file is 3.8MB for mm and this card had no placeholder at all —
            without it the thumbnail is an empty box for seconds on mobile. the
            poster IS frame 1, so there is no visible swap when the real file
            arrives. the brightness/grayscale filters live on this wrapper so
            they treat the placeholder and the image identically.

            the idle tint is a duotone built from filters only, so it stays on
            this one className: sepia crushes the image to a single hue (a warm
            ~40deg orange), hue-rotate spins that hue to the colour we want and
            saturate sets how strong it reads. THAT hue-rotate value is the
            colour knob — sepia's 40deg is the starting point, so the angle is
            roughly (target hue - 40):
              blue   210deg -> hue-rotate-[170deg]
              teal   180deg -> hue-rotate-[140deg]
              green  140deg -> hue-rotate-[100deg]
              purple 270deg -> hue-rotate-[230deg]
              pink   320deg -> hue-rotate-[280deg]
            drop the saturate for a whisper of colour, raise it to shout.
            hovering clears all of it and the real photo shows through.

            brightness is the light/dark knob: 100 is the untouched image,
            below darkens, above lightens. it's a multiply, so pushing it far
            past 100 clips the highlights to flat white — if it starts looking
            washed out, pair it with a bit more contrast rather than winding
            the brightness back down. */}
        <div
          className={`md:shrink-0 h-48 w-full bg-cover bg-center md:h-auto md:w-80 xl:w-96 2xl:w-[26rem] brightness-100 transition-[filter] duration-600 ${hover? " brightness-120 contrast-80" : "grayscale contrast-50"}`}
          style={{
            backgroundImage: `url(${project.images.main[0].replace(/\.[^.]+$/, "-poster.webp")})`,
          }}
        >
          <img
            className="h-48 w-full object-cover md:h-full"
            src={project.images.main[0]}
            alt={`${project.title} preview`}
            loading="lazy"
            decoding="async"
          />
        </div>
        {/* p-8 at every width below xl, matching About — the section cards and
            the project cards are the same object to a reader, so the text
            should sit the same distance off the border on all of them.

            this used to drop to p-5 on mobile, guarding against p-8 stacking
            with the paragraph's own px-5 and me-10: together they came to
            144px, 40% of the 361px a 393px phone leaves for the card, and the
            text was squeezed into ~217px. that stacking is gone — every inner
            offset here is md:+ only now (px-0 me-0 on the paragraph, mx-0 on
            the title, px-0 on the tag row), so on a phone p-8 is the whole
            budget: 64px of 361, leaving ~297px of text. the guard was still
            costing 12px a side for a problem that no longer exists.
            if you ever make those inner offsets apply on mobile again, this
            is the line that has to come back down. */}
        <div className="min-w-0 p-8 xl:p-12 flex flex-col justify-between">
          <div className="flex flex-row justify-between items-center">
          <h2
          className={`text-2xl xl:text-3xl mx-0 md:mx-5 border-b-2 ${hover? "border-line" : "border-transparent" } font-semibold group-hover:text-card-accent transition-colors duration-600`}
          >{project.title}</h2>
          </div>
          <p className={`mt-4 mb-4 px-0 me-0 md:mt-7 md:mb-7 md:px-5 md:me-10 ${color} flex-grow`}>
            {project.short_description}
          </p>
          <div className=" flex px-0 md:px-5 flex-wrap gap-2 flex-end">
            {/* the tags set no text colour of their own, so they were
                inheriting plain text-ink from the app root and sitting still
                while the title and the description moved to the card accent.
                group-hover brings them along with the rest — the card root is
                the `group`. same treatment as the About tags in SkillList.
                border-card-accent too, otherwise the box outline stays at
                --color-line while the label inside it changes, which reads as
                half-finished rather than as a deliberate pair. */}
            {project.tags.map((t) => (
            <PaperTag key={t} width="" id={project.id + t} color={"border-line group-hover:text-card-accent group-hover:border-card-accent transition-colors duration-600 hover:bg-ink/10"} tag={t}></PaperTag>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}