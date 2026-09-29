import { useState } from "react";
import { Bs1Circle } from "react-icons/bs";
import MiniHeadlines from "./MiniHeadlines";
import SkillList from "./SkillList";
import TopDescription from "./TopDescription";

type AboutProps = {
  ref: any;
  title: string;
  id?: string;
  content?: string;
  image?: string;
  skills?: string[];
  softSkills?: string[];
  topics?: string[];
};

export default function About({ title, id, ref, topics }: AboutProps){
  const [hover,setHover] = useState(false);

    return(
      <div className="min-h-dvh flex items-center justify-center py-10">
      <div
        ref={ref}
        id={id}
        onMouseEnter={()=>setHover(true)}
        onMouseLeave={()=>setHover(false)}
        className="cursor-default md:mb-0 w-full h-250 md:h-[clamp(500px,62vh,820px)] hover:bg-blend-multiply backdrop-blur-2xl backdrop scroll-mt-[25vh] mx-auto max-w-lg overflow-hidden rounded-xl shadow-md md:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl z-2">
          <div className="md:flex h-full">
            <div className="md:shrink-0"/>
            <div className="flex flex-col justify-around p-8 xl:p-12 h-full">
              <div className="flex opacity-0 flex-row justify-between">
                <Bs1Circle className="flex self-end"/>
                <p>About</p>
              </div>
              <h2
                className={`text-5xl xl:text-6xl 2xl:text-7xl border-b-2 ${hover? "border-cyan-200" : "border-transparent" } w-fit font-semibold mb-4`}
              >
                  {title}
              </h2>
              <TopDescription hover={hover}/>
              <div className="flex md:flex-row flex-col md:ps-6 ps-0">
                <div className="flex w-1/6"/>
                    <SkillList topics={topics}/>
                    <MiniHeadlines/>
                </div>
            </div>
        </div>
      </div>
      </div>
    );
}