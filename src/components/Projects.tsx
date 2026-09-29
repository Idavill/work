import { GrAdd } from "react-icons/gr";
import { useState } from "react";
import { Bs2Circle } from "react-icons/bs";

type ProjectsProps = {
  ref: any;
  title: string;
  id?: string;
  content?: string;
  image?: string;
  skills?: string[];
  softSkills?: string[];
  topics?: string[];
};

export default function Projects({ title, id, ref }: ProjectsProps

){
    const [hover,setHover] = useState(false);
    return(
      <div className="flex items-end justify-center pt-10 pb-0">
      <div ref={ref} id={id} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      className="mb-3 w-full cursor-default h-120 md:h-[clamp(280px,38vh,460px)] hover:bg-blend-multiply backdrop-blur-2xl backdrop scroll-mt-30 mx-auto max-w-lg overflow-hidden rounded-xl  shadow-md md:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl z-2">
          <div className="md:flex h-full">
            <div className="md:shrink-0">
            </div>
            <div className="flex flex-col justify-around p-8 xl:p-12 h-full">
              <div className="flex opacity-0 text-gray-400 flex-row justify-between">
                <Bs2Circle className="flex self-end"/>
                <p>Projects</p>
              </div>
              <h2 className={`text-5xl xl:text-6xl 2xl:text-7xl border-b-2 ${hover? "border-white" : "border-transparent" } w-fit font-semibold mb-4`}>{title}</h2>
              <div className="flex flex-col md:flex-row">
                <GrAdd className="flex w-1/6 mb-5 md:mb-0"/>
                <div className="flex flex-col pl-0 md:pl-5 w-full md:w-5/6">
                  <p className="flex break-words w-full" >Below you can explore a selection of my most recent interactive, data-driven, and colorful projects.</p>
                  <p className="flex break-words w-full" >This includes interactive pieces, data analysis and visualizations, as well as creative coding projects</p>
                </div>
              </div>
            </div>
        </div>
      </div>
      </div>
    );
}