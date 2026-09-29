import { useState } from "react";

export default function MiniHeadlines(){
    const [hover1,setHover1] = useState(false);
    const [hover2,setHover2] = useState(false);

    return(
        <>
        <div
            className="flex text-white opacity-75 flex-col justify-between md:my-0 md:w-3/6 w-full">
            <section
                onMouseEnter={()=>setHover1(true)}
                onMouseLeave={()=>setHover1(false)}
                className={`flex flex-col px-2 py-1 `}>
                <p className={`flex border-b-2 w-fit ${hover1? "border-white": "border-transparent" }`}>VISUAL STORIES</p>
                <p className="flex break-words">I love to tell stories that are inherently visual and spatial</p>
            </section>
            <section
                onMouseEnter={()=>setHover2(true)}
                onMouseLeave={()=>setHover2(false)}
                className={`flex flex-col px-2 py-1`}>
                <p className={`flex border-b-2 w-fit ${hover2? "border-white": "border-transparent" }`}>CODE AND TOOLS</p>
                <p className="flex break-words">It's not about the tool, but about the task. My toolbox spans from backend to frontend.</p>
            </section>
        </div>
        </>
    )
}