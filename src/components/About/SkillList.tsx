import PaperTag from "../PaperTag";

type SkillListType = {
    topics: string[] | undefined
}

export default function SkillList({topics}:SkillListType){
    return(
        <>
            { topics &&
            /* the md+ grid cell, col-span-2 of 6 (was md:w-2/6). this stack is
               deliberately content-height: it is what sizes the row, and the
               headlines next to it stretch to match. justify-start + gap-2 keeps
               the tags tight rather than fanned out. */
            <div className="flex w-full md:col-span-2 flex-col justify-start gap-2">
                {topics.map((t) => (
                <div key={t}>
                    {/* mr-5 only from md: there it is the gutter to the
                        headlines column, which the grid has no gap-x for. while
                        stacked it just made the tags 20px narrower than the
                        headline boxes above them. */}
                    {/* group-hover opts the tags into the About card's hover
                        colour — their explicit text-ink would otherwise keep
                        them at the resting colour while the rest of the card
                        changed. the card is the `group`. */}
                    <PaperTag id={"c"} color={"text-ink group-hover:text-card-accent transition-colors duration-600 hover:bg-ink/10"} width={"md:mr-5 "} tag={t}/>
                </div>
                ))}
            </div>
            }
        </>
    )
}