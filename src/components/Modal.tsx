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
            <div className="fixed inset-0 flex items-center justify-center">
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
                <div className="absolute z-10 modal-box">
                <BigCard project={project}/>
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