import PaperTag from "../PaperTag";

type SkillListType = {
    topics: string[] | undefined
}

export default function SkillList({topics}:SkillListType){
    return(
        <>
            { topics &&
            <div className="flex w-full md:w-2/6 flex-col justify-between gap-2">
                {topics.map((t) => (
                <div key={t}>
                    <PaperTag id={"c"} color={"text-white hover:bg-white/10"} width={"mr-5 "} tag={t}/>
                </div>
                ))}
            </div>
            }
        </>
    )
}