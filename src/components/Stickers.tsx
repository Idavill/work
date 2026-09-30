import Sticker from "./Sticker";

// positions are viewport percentages, chosen to sit in the margins either
// side of the content column rather than on top of the cards
const FRUITS = [
  { emoji: "🍓", label: "strawberry sticker", x: 5, y: 24, tilt: -9 },
  { emoji: "🍋", label: "lemon sticker", x: 88, y: 32, tilt: 7 },
  { emoji: "🍒", label: "cherries sticker", x: 6, y: 56, tilt: 5 },
  { emoji: "🥝", label: "kiwi sticker", x: 90, y: 62, tilt: -6 },
  { emoji: "🍐", label: "pear sticker", x: 4, y: 82, tilt: 8 },
];

export default function Stickers() {
  return (
    // pointer-events-none on the layer so only the stickers themselves are
    // clickable — the cards underneath stay fully interactive
    <div className="pointer-events-none fixed inset-0 z-[5]">
      {FRUITS.map((sticker) => (
        <Sticker
          key={sticker.emoji}
          startX={sticker.x}
          startY={sticker.y}
          tilt={sticker.tilt}
          label={sticker.label}
        >
          <span
            className="text-4xl md:text-5xl leading-none"
            // --sticker-filter is per theme: lightens on dark pages,
            // darkens on paper. see index.css.
            style={{ filter: "var(--sticker-filter)" }}
          >
            {sticker.emoji}
          </span>
        </Sticker>
      ))}
    </div>
  );
}
