import { useState } from "react";

export default function MiniHeadlines(){
    const [hover1,setHover1] = useState(false);
    const [hover2,setHover2] = useState(false);

    return(
        <>
        <div
            className="flex text-ink opacity-75 flex-col justify-between md:my-0 md:w-3/6 w-full">
            <section 
                onMouseEnter={()=>setHover1(true)}
                onMouseLeave={()=>setHover1(false)}
                className={`flex flex-col border-2 px-2 py-1 `}>
                <p className={`flex border-b-2 w-fit ${hover1? "border-line": "border-transparent" }`}>VISUAL STORYTELLING</p>
                <p className="flex break-words">I love to tell stories that are inherently visual and spatial situated i.e. in the urban fabric and our lived experience</p>
            </section>
            <section
                onMouseEnter={()=>setHover2(true)}
                onMouseLeave={()=>setHover2(false)}
                className={`flex flex-col border-2 px-2 py-1`}>
                <p className={`flex border-b-2 w-fit ${hover2? "border-line": "border-transparent" }`}>DIVERSE TECHNOLOGIES</p>
                <p className="flex break-words">It's not about the tool, but about the task. My toolbox spans from engineering, analysis to design</p>
            </section>
        </div>
        </>
    )
}