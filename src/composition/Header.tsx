import Button from "../components/Button"

type HeaderProps = {
  headerOpacity: number;
  selectedProject: boolean;
}

export default function Header({headerOpacity, selectedProject}: HeaderProps) {
    // fixed, not sticky. sticky is clamped to its containing block and also
    // still scrolls HORIZONTALLY with the page, so while the header was
    // overflowing a phone it slid off to the left as soon as you panned. fixed
    // pins to the viewport unconditionally — which is all this header ever
    // wanted — at the cost of leaving the flow, hence the pt-* on <main> in
    // App.tsx that replaces the space it used to take up.
    return(
    <>
        {!selectedProject && (
        <header
          className="flex flex-row place-content-around fixed top-0 inset-x-0 z-4 p-4 transition-colors duration-300"
        >
          {/* "flexmd:w-fit" was one word — a missing space, so neither `flex`
              nor `md:w-fit` existed and this box silently fell back to a
              block. */}
          <div
            className="flex md:w-fit justify-center rounded-none border p-1"
            style={{
              boxShadow: headerOpacity > 0.2 ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
              // backdropFilter: headerOpacity > 0.2 ? "blur(16px)" : "none",
              backgroundColor: `color-mix(in srgb, var(--color-surface) ${headerOpacity * 100}%, transparent)`,
              // border width stays on the element; only its colour fades, so
              // the box never shifts by a pixel as it appears
              borderColor: `color-mix(in srgb, var(--color-line) ${headerOpacity * 100}%, transparent)`,
          }}>
            {/* w-full below md: w-110 is a fixed 440px, wider than every phone
                in portrait (iPhone 16 is 393), so the sticky header alone forced
                the document wider than the viewport. the four buttons need
                ~320px, which fits the 361px a 393px screen leaves after the
                header's p-4. */}
            <div className="flex flex-row justify-center place-content-around w-full md:w-150 lg:w-150">
              <a href="#top"><Button name="↑" /></a>
              <a href="#about"><Button name="About" /></a>
              <a href="#projects"><Button name="Projects" /></a>
              {/* <a href="#education"><Button name="Experience" /></a> */}
              <a href="#contact"><Button name="Contact" /></a>
            </div>
          </div>
        </header>
        )}
    </>
    )
}