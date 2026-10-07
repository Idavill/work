import BigCard from "./BigCard";
import type { ProjectType } from "../types/Types";

type ModalProps = {
  project: ProjectType;
  open: boolean;
  setOpen: (open: boolean) => void;
  children?: React.ReactNode;
};

export default function Modal({open, setOpen, project}:ModalProps) {
    return(
        <>
        {open && (
            <>
            {/* px-4 md:px-10 mirrors <main>'s own p-4 md:p-10 in App.tsx, which
                is the first thing that decides how wide a project card can be.
                only the HORIZONTAL half is copied — main's pt-24/md:pt-28 is
                there to clear the fixed header, and bringing it here would shove
                the overlay off centre. py-6 is just so a tall card never touches
                the top and bottom edges. */}
            <div className="fixed inset-0 flex items-center justify-center px-4 py-6 md:px-10">
                {/* fixed to the VIEWPORT, not to the card's own corner: on a
                    phone the card fills the screen, so a cross pinned to the
                    card can sit off-screen — and the backdrop <form> below is
                    unreachable for the same reason, which is why there was no
                    way out at all. z-20 clears the card's z-10.
                    the !s are needed because the bare `button` rule in
                    index.css is unlayered, so its border-radius/border/padding
                    outrank plain utilities. mirrors ThemeToggle's corner
                    button, which solves the same problem with inline styles. */}
                <button
                style={{
                    background: "var(--color-canvas)",
                }}
                  onClick={() => setOpen(false)}
                  aria-label="Close project"
                  className="fixed top-4 right-4 md:top-6 md:right-6 z-20 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center border! border-line! rounded-none! p-0! bg-surface text-ink transition-colors duration-400 hover:bg-hover hover:text-accent"
                >
                  <span aria-hidden="true" className="text-2xl leading-none">✕</span>
                </button>
                {/* the overlay is as wide as a project card in the list, and it
                    gets there by rebuilding the same chain rather than guessing
                    a number: main's horizontal padding (above), then App.tsx's
                    content column, then Card.tsx's own width rules. a single
                    hand-picked width cannot match it, because a card's width is
                    whichever of those three bites first — the column's 88vw at
                    xl, the cap at 2xl, the viewport on a phone.

                    the width had to be stated SOMEWHERE here because `modal-box`
                    is dead: daisyui is in package.json but was never registered
                    (tailwind v4 wants `@plugin "daisyui";` in index.css and
                    there is none), so the class matches nothing and this was a
                    bare position:absolute with no width — shrink-to-fit, which
                    is why every project's description produced its own overlay
                    width. same story for `carousel`/`carousel-item` in
                    Carousel.tsx and `modal-backdrop` below: all inert, the
                    slides work off the tailwind flex/snap utilities alone.

                    a flex item now, not absolute. two reasons: a percentage
                    width on an absolutely positioned box resolves against its
                    containing block's PADDING box, so the px-* above would have
                    been ignored — and in flow it is centred by the parent's
                    items/justify-center rather than by abspos static-position
                    rules. z-10 keeps it over the backdrop form. */}
                {/* layer 1: App.tsx's content column, verbatim. it is a flex
                    item there and here, so when those fixed widths exceed the
                    space (w-300 is 1200px on a 1024px screen) it shrinks to fit
                    exactly as the real one does. */}
                <div className="flex w-full md:w-200 lg:w-300 xl:w-[88vw] xl:max-w-[1600px] justify-center">
                    {/* layer 2: Card.tsx's width rules, verbatim — including
                        both m-3 and mx-auto. they are copied as a pair on
                        purpose: they both set the side margins and which one
                        wins is down to tailwind's output order, so mirroring the
                        whole set means this box resolves the same way the card
                        does without anyone having to work out which. */}
                    <div className="relative z-10 m-3 w-full mx-auto max-w-lg md:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                        <BigCard project={project}/>
                    </div>
                </div>
                <form onClick={() => setOpen(false)}
                    method="dialog"
                    className="absolute w-full h-full modal-backdrop z-0">
                </form>
            </div>
            </>
            )}

        </>
    )
}