import PaperTag from "../PaperTag";

type SkillListType = {
    topics: string[] | undefined
}

export default function SkillList({topics}:SkillListType){
    return(
        <>
            { topics &&
            <div className="flex w-full md:w-2/6 flex-wrap flex-col gap-2 flex-end">
                {topics.map((t) => (
                <div key={t}>
                    <PaperTag id={"c"} color={"text-cyan-200 hover:bg-white/10"} width={"mr-5 "} tag={t}/>
                </div>
                ))}
            </div>
            }
        </>
    )
}