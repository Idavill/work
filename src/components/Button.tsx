
type ButtonProps = {
  key?:string;
  name: string;
  onClick?: Function;
};

export default function Button({ name }: ButtonProps) {

  // a <span>, NOT an <h2>: `@layer base h2 { font-size: 1.5em }` in index.css
  // made every nav label 24px, which is a third of why the header would not fit
  // a phone. nav labels are not headings anyway.
  // and px-*! / py-*! with the important suffix, because the bare `button` rule
  // in index.css is UNLAYERED — its `padding: 0.6em 1.2em` (38.4px per button,
  // horizontally) outranks any normal utility, so plain px-4 was being ignored.
  return (
    <button className=" text-ink rounded-3xl bg-transparent hover:border-transparent hover:bg-surface hover:text-accent  active:text-accent px-2! py-1! md:px-4! md:py-2!">
      {/* 18px on phones, back up to the original 24px from md. this is safe
          ONLY because the padding above is now rem-based (px-2!/py-2!) instead
          of the stylesheet's 1.2em — em padding would have grown with the
          label and eaten the headroom twice over. */}
      <span className="text-lg md:text-2xl">{name}</span>
    </button>
  );
}
