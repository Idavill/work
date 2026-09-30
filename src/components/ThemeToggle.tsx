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
  paper: "✿",
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

  function nextTheme() {
    setTheme((current) => THEMES[(THEMES.indexOf(current) + 1) % THEMES.length]);
  }

  return (
    <button
      onClick={nextTheme}
      title={`Theme: ${theme}`}
      aria-label={`Change theme, currently ${theme}`}
      className="group fixed bottom-6 right-6 z-4 flex h-14 w-14 items-center justify-center border border-line bg-surface text-ink transition-colors duration-300 hover:bg-hover hover:text-accent"
      // the bare `button` rule in index.css is unlayered, so its 8px radius and
      // 0.6em/1.2em padding beat any utility class. inline styles are the only
      // thing that outranks it, which is why the box lives here and not above.
      // shadow is a scaled-down --shadow-hard: the token's 14px offset is sized
      // for the big cards and reads as a smear behind a 48px square.
      style={{
        borderRadius: 0,
        padding: 0,
        boxShadow: "4px 4px 0 var(--color-shadow)",
      }}
    >
      <span
        aria-hidden="true"
        className="text-xl leading-none transition-transform duration-300 group-hover:rotate-[72deg] group-hover:scale-125"
      >
        <h2>{THEME_STARS[theme]}</h2>
      </span>
    </button>
  );
}
