import { useState } from "react";

export default function MiniHeadlines(){
    const [hover1,setHover1] = useState(false);
    const [hover2,setHover2] = useState(false);

    return(
        <>
        <div
            className="flex text-cyan-200 opacity-75 flex-col md:my-0 md:w-3/6 w-full">
            <section
                onMouseEnter={()=>setHover1(true)}
                onMouseLeave={()=>setHover1(false)}
                className={`flex flex-col p-2 `}>
                <p className={`flex border-b-2 w-fit ${hover1? "border-cyan-200": "border-transparent" }`}>VISUAL STORIES</p>
                <p className="flex break-words">I love to tell stories that are inherently visual and spatial</p>
            </section>
            <section
                onMouseEnter={()=>setHover2(true)}
                onMouseLeave={()=>setHover2(false)}
                className={`flex flex-col p-2`}>
                <p className={`flex border-b-2 w-fit ${hover2? "border-cyan-200": "border-transparent" }`}>CODE AND TOOLS</p>
                <p className="flex break-words">It's not about the tool, but about the task. My toolbox spans from backend to frontend.</p>
            </section>
        </div>
        </>
    )
}