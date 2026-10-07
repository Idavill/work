import { useState } from "react";

export default function MiniHeadlines(){
    const [hover1,setHover1] = useState(false);
    const [hover2,setHover2] = useState(false);

    return(
        <>
        {/* the outer div is the grid cell (col-span-3 of 6, h-full), the inner
            one holds the boxes.

            from md up the inner block is absolute inset-0, which is the whole
            trick for matching heights: out of flow, it contributes nothing to
            the row, so the row is sized by the tag stack beside it and this
            block is then stretched to exactly that height — bottoms line up at
            every width, with no dependence on how the prose happens to wrap.
            (overflow-hidden was the earlier attempt and did not work: it zeroes
            an item's automatic minimum size, but fr rows size from max-content
            contributions, which it leaves alone. It also clipped the children's
            left border, since the fr column width is fractional.)

            the sections are md:flex-1 md:min-h-0 to divide that height between
            them — scoped to md+ because below md there is no cell height to
            divide and they must keep their own content height.
            their content is justify-start with a fixed px-3 py-2, so the text
            keeps the same small inset from the border at every width — centring
            it made the inset look like it grew and shrank with the screen, since
            the leftover height was split above and below the words.

            and the type scales fluidly rather than stepping at breakpoints —
            stepped sizes rewrapped the prose into an extra line at the middle
            widths. below md the block is static and sizes to its content.

            the clamp caps at 0.875rem on purpose. each section gets about half
            the row, ~82px of text room once padding and borders come off, and at
            1rem the blurb sat right on the 2/3-line boundary in the xl column —
            three lines plus the title is ~88px there, which is what pushed the
            last line onto the bottom border. 0.875rem keeps it at two lines with
            room to spare, so lengthening either blurb much is what would bring
            the problem back. */}
        <div className="relative h-full w-full md:col-span-3">
            {/* group-hover, not hover: the hovered element is the About card
                several levels up (it carries `group`). an explicit text-ink
                here means this block does not inherit the card's hover colour
                the way the rest of its text does, so it has to opt in.

                text-ink/75 rather than `text-ink opacity-75`: opacity applies
                to the whole subtree, so it was letting the section BORDERS
                down to 75% too — and the tags next door are a flat
                border-line, so the two columns could never match however the
                border colour was named. the /75 is on the text colour alone. */}
            <div className="flex flex-col gap-4 text-ink/75 group-hover:text-card-accent transition-colors duration-600 md:absolute md:inset-0 md:text-[clamp(0.75rem,1.05vw,0.875rem)] md:leading-snug">
                <section
                    onMouseEnter={()=>setHover1(true)}
                    onMouseLeave={()=>setHover1(false)}
                    // border-line, matching PaperTag in SkillList next door.
                    // bare `border-1` is not a colour: tailwind v4 defaults
                    // border-color to currentColor, so these boxes were
                    // tracking the text — and so changing to the accent on
                    // card hover while the tags stayed put.
                    className={`flex hover:bg-ink/10 md:flex-1 md:min-h-0 flex-col justify-start border-1 border-line px-3 py-2 `}>
                    <p className={`flex border-b-2 w-fit ${hover1? "border-line": "border-transparent" }`}>✧⋆ Visual Storytelling ⋆✧ </p>
                    <p className="flex break-words">I love to tell stories that are inherently visual and spatial situated i.e. in the urban fabric and our lived experience</p>
                </section>
                <section
                    onMouseEnter={()=>setHover2(true)}
                    onMouseLeave={()=>setHover2(false)}
                    className={`flex hover:bg-ink/10 md:flex-1 md:min-h-0 flex-col justify-start border-1 border-line px-3 py-2`}>
                    <p className={`flex border-b-2 w-fit ${hover2? "border-line": "border-transparent" }`}>✧⋆ Diverse technologies ⋆✧</p>
                    <p className="flex break-words">It's not about the tool, but about the task. My toolbox spans from engineering, analysis to design</p>
                </section>
            </div>
        </div>
        </>
    )
}
