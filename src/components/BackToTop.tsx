import { useEffect, useState } from "react";
import { BsArrowUp } from "react-icons/bs";

type BackToTopProps = {
  selectedProject: boolean;
};

// floating shortcut back to the top of the page.
//
// deliberately an <a href="#top"> rather than a <button>: the bare `button`
// rule in index.css is unlayered, so it would beat this element's padding and
// border-radius utilities and force the icon into a rounded 8px pill. the
// header's ↑ uses the same anchor + #top target, so both land in one place.
// the smooth scroll itself comes from `scroll-behavior: smooth` on html.
export default function BackToTop({ selectedProject }: BackToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // same 300px threshold the header uses to finish fading in, so the two
    // arrive together instead of the corner icon popping in on its own
    const handleScroll = () => setVisible(window.scrollY > 300);
    handleScroll(); // catch a reload that restores a mid-page scroll position
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (selectedProject) return null;

  return (
    <a
      href="#top"
      aria-label="Back to top"
      title="Back to top"
      // hidden from the tab order and the a11y tree while faded out, otherwise
      // it stays focusable as an invisible target at the top of the page
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 right-6 z-4 flex h-12 w-12 items-center justify-center border border-line bg-surface text-ink transition-all duration-300 hover:bg-hover ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      // scaled-down --shadow-hard: the token's 14px offset is sized for the
      // big cards and reads as a smear behind a 48px square
      style={{ boxShadow: "4px 4px 0 var(--color-shadow)" }}
    >
      <BsArrowUp className="h-5 w-5" />
    </a>
  );
}
