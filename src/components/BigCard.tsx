import type { ProjectType } from "../types/Types";
import Carousel from "./Carousel";

type BigCardProps = {
  project: ProjectType;
};

export default function BigCard({project}: BigCardProps) {
  return (
    <div className="mx-auto cursor-default max-w-lg rounded-xl bg-gray-950 shadow-md md:max-w-11/12 z-2">
      <div className="lg:flex max-h-200 md:min-h-[600px]">
        <div className="flex-grow flex items-center justify-center min-w-[300px] md:min-w-[600px]">
          <Carousel images={project.images} id={["1234","4321","4331"]}/>
        </div>
        <div className="flex m-12 flex-col justify-center">
          <h2 className="text-5xl border-b-2 border-gray-500 w-fit font-semibold mb-4">
            {project.title}
          </h2>
          <p className="max-mt-4 overflow-y-scroll text-balance text-gray-400 max-h-80">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
}