type FancyTopProps = {
  ref: any;
  title: string;
  id?: string;
  selectedProject:boolean;
  currentSection:string;
};

export default function SectionCard({ id, ref, currentSection}: FancyTopProps){
    return(
      <div
        ref={ref}
        id={id}
        className="cursor-default w-full relative scroll-mt-30 mx-auto mt-20 h-dvh max-w-2xl overflow-visible lg:max-w-5xl"
      >
        {/* the section indicator in the left margin: hidden below md. narrow
            screens have no margin for it to sit in, so it overlaps the cards,
            which run full width there. */}
        <div className="fixed left-10 hidden lg:flex h-4/10 w-10 ">
          <h2
          id="bytesized-medium"
          className={`flex text-progress rotate-180`}
          >
            {currentSection}
          </h2>
        </div>

        <div
          id="topSketch"
          className="flex justify-center items-center absolute inset-0 w-full h-6/10" 
        ></div>
      </div>
    );
}

