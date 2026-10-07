import { useEffect, useState } from "react";

// every theme here must have a matching html[data-theme="..."] block
// in index.css. add to both or the toggle will cycle to a dead value.
export const THEMES = ["mono", "paper", "green"] as const;
export type Theme = (typeof THEMES)[number];

const STORAGE_KEY = "theme";

// a star per theme, so the corner glyph doubles as a read-out of which one
// you're on. typed as a full Record, so adding a theme above without a star
// here is a compile error rather than a blank button.
const THEME_STARS: Record<Theme, string> = {
  mono: "✦",
  paper: "◥",
  green: "✶",
};

function isTheme(value: string | null): value is Theme {
  return !!value && (THEMES as readonly string[]).includes(value);
}

function readStoredTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isTheme(saved)) return saved;
  } catch {
    // private browsing can throw on localStorage access
  }
  return THEMES[0];
}

// floating theme switcher, parked in the bottom-left corner as the mirror of
// BackToTop's bottom-right arrow. unlike that one it never fades out: it's
// fixed and always clickable, including over an open project modal, since the
// fixed wrapper sits above main's z-2 stacking context.
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // not being able to persist shouldn't break the toggle
    }
  }, [theme]);

  // the theme no longer cycles on click — this is the easter-egg button now,
  // and the state above is kept purely to apply and persist the theme you
  // settled on. to bring cycling back, point onClick at this instead.
  function nextTheme() {
    setTheme((current) => THEMES[(THEMES.indexOf(current) + 1) % THEMES.length]);
  }
  void nextTheme;

  // shake the dot-grid background. a window CustomEvent rather than a direct
  // call, because background_sketch.js is a plain script loaded by index.html
  // — it lives outside react's tree and cannot be imported from here. the
  // sketch listens for this name; the two share nothing else.
  // spin is local feedback so the button acknowledges the click even for
  // someone on prefers-reduced-motion, where the sketch deliberately ignores
  // the event and the background stays perfectly still.
  const [spin, setSpin] = useState(0);
  function shakeBackground() {
    window.dispatchEvent(new CustomEvent("background:shake"));
    setSpin((n) => n + 1);
  }

  return (
    <button
      onClick={shakeBackground}
      title="Shake the background"
      aria-label="Shake the background"
      // text-progress, not text-muted: this star and the dot indicator in the
      // left margin (FancyTop.tsx) are the site's two loose glyphs — floating
      // in the margins, outside any card, both now carrying the same hard
      // offset shadow. sharing --color-progress is what makes them read as
      // one family rather than two one-offs, and it means recolouring that
      // one token moves both of them together.
      // --color-muted stays what it is for: secondary text inside the cards.
      className="group fixed bottom-6 right-6 z-4 flex h-14 w-14 items-center justify-center border border-line bg-surface text-progress transition-colors duration-400 hover:bg-hover hover:text-accent"
      // the bare `button` rule in index.css is unlayered, so its 8px radius and
      // 0.6em/1.2em padding beat any utility class. inline styles are the only
      // thing that outranks it, which is why the box lives here and not above.
      // shadow is a scaled-down --shadow-hard: the token's 14px offset is sized
      // for the big cards and reads as a smear behind a 48px square.
      style={{
        // borderRadius: 0,
        // padding: 0,
        // boxShadow: "4px 4px 0 var(--color-shadow)",
        // background: "var(--color-canvas)",
        border:"0px solid",
      }}
    >
      {/* the star turns a further 144deg on every click — a fifth of a turn,
          so a five-pointed star lands back on itself after five of them and
          the spin reads as the star rolling rather than wobbling. the hover
          rotate still applies on top, since both are transforms on the same
          element and tailwind's rotate utility is the one being overridden by
          the inline style here. */}
      <span
        aria-hidden="true"
        style={{
          transform: `rotate(${spin * 144}deg)`,
          // the same hard offset shadow the cards and the left-margin
          // indicator have: no blur, straight --color-shadow.
          //
          // text-shadow and not box-shadow, for the same reason as the
          // indicator in index.css — the box here is a bare span with no
          // background, so a box-shadow would paint an offset rectangle
          // rather than trace the star.
          //
          // --color-muted, to match what the indicator's text-shadow uses in
          // index.css. NOT --color-shadow, which is the cards' token: that one
          // is tuned to read as a solid slab behind a big rectangle, and the
          // muted grey is what suits a thin glyph. the two loose glyphs share
          // it, so one token moves both.
          //
          // and em, not px. the indicator hardcodes its offset against a 6.5em
          // glyph; this star is a different size again, so a shared pixel value
          // would read as a slab behind one and a hairline behind the other.
          // em tracks the font-size on its own.
          //
          // the shadow sits on the rotating element, so it swings around the
          // star as it spins rather than staying pinned down-right. that is
          // deliberate on a thing whose whole job is to spin — move it to the
          // <h1> below to hold it still.
          textShadow: "0.13em 0.13em 0 var(--color-muted)",
        }}
        className="text-2xl leading-none transition-transform duration-500 group-hover:rotate-[72deg]"
      >
        <h1>{THEME_STARS[theme]}</h1>
      </span>
    </button>
  );
}
