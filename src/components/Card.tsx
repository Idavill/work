import { useState } from "react";
import type { ProjectType } from "../types/Types";
import PaperTag from "./PaperTag";

type CardProps = {
  project: ProjectType
  open: Object | null;
  setOpen: (x: boolean) => void;
};

export default function Card({ project, setOpen }: CardProps) {
  const [hover,setHover] = useState(false);
   let color = "text-ink opacity-75"

  return (
      <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} key={project.id}
      className={`flex mb-7 justify-center m-3 w-full border-r-8 border-transparent cursor-pointer hover:bg-hover transition-colors duration-200 backdrop-blur-2xl backdrop scroll-mt-30 mx-auto max-w-lg overflow-hidden rounded-xl shadow-md md:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl z-2`}
      onClick={() => setOpen(true)}
      >
      <div className="md:flex">
        <div className="md:shrink-0">
          <img
            className={`h-48 w-full object-cover md:h-full md:w-80 xl:w-96 2xl:w-[26rem] brightness-80 ${hover? "contrast-100" : "grayscale contrast-70"}`}
            src={project.images.main[0]}
            alt={`${project.title} preview`}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="p-8 xl:p-12 flex flex-col justify-between">
          <div className="flex flex-row justify-between items-center">
          <h2
          className={`text-2xl xl:text-3xl mx-5 border-b-2 ${hover? "border-line" : "border-transparent" } font-semibold`}
          >{project.title}</h2>
          </div>
          <p className={`mt-7 mb-7 px-5 ${color} me-10 flex-grow`}>
            {project.short_description}
          </p>
          <div className=" flex px-5 flex-wrap gap-2 flex-end">
            {project.tags.map((t) => (
            <PaperTag key={t} width="" id={project.id + t} color={"border-line hover:bg-ink/10"} tag={t}></PaperTag>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}