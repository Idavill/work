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
                    <PaperTag id={"c"} color={"text-ink hover:bg-ink/10"} width={"mr-5 "} tag={t}/>
                </div>
                ))}
            </div>
            }
        </>
    )
}