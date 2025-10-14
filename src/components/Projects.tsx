import { GrAdd } from "react-icons/gr";
import { useState } from "react";
import SharpiSection from "./SharpiSection";
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
      <div ref={ref} id={id} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      className="mb-10 mt-120 md:mt-0 cursor-default h-120 md:h-80 hover:bg-blend-multiply backdrop-blur-2xl backdrop scroll-mt-30 mx-auto max-w-lg overflow-hidden rounded-xl  shadow-md md:max-w-4xl z-2">
          <div className="md:flex">
            <div className="md:shrink-0">
            </div>
            <div className="flex flex-col justify-between p-8 h-80">
              <div className="flex opacity-0 text-gray-400 flex-row justify-between">
                <Bs2Circle className="flex self-end"/>
                <p>Projects</p>
              </div>
              <h2 className={`text-5xl border-b-2 ${hover? "border-cyan-200" : "border-transparent" } w-fit font-semibold mb-4`}>{title}</h2>
              <div className="flex flex-col md:flex-row">
                <GrAdd className="flex w-1/6 mb-5 md:mb-0"/>
                <div className="flex flex-col pl-0 md:pl-5 w-full md:w-5/6">
                  <p className="flex break-words w-full" >Below you can explore a selection of my most recent </p>
                  <SharpiSection
                    text={`interactive, data-driven and colorful projects.`}
                    backgroundSize={`${hover ? "100% 100%" : "0% 100%"}`}
                  />
                  <p className="flex break-words w-full" >This includes interactive pieces, data analysis and visualizations, as well as creative coding projects</p>
                </div>
              </div>
            </div>
        </div>
      </div>
    );
}