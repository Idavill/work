import { useEffect, useState } from "react";

// every theme here must have a matching html[data-theme="..."] block
// in index.css. add to both or the toggle will cycle to a dead value.
export const THEMES = ["mono", "paper", "green"] as const;
export type Theme = (typeof THEMES)[number];

const STORAGE_KEY = "theme";

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
      className="text-ink rounded-3xl bg-transparent hover:border-transparent hover:bg-surface hover:text-accent active:text-accent px-4 py-2"
    >
      <h2>◐</h2>
    </button>
  );
}
