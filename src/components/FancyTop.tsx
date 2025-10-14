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
        <div className="fixed left-10 flex h-4/10 w-10 ">
          <h2
          id="bytesized-medium"
          className={`flex text-green-500 rotate-180`}
          >
            {currentSection}
          </h2>
        </div>

        <div
          id="topSketch"
          className="flex justify-center items-center absolute inset-0 w-full h-6/10" 
        ></div>
        <div className="flex justify-center flex-col items-center md:flex-row absolute inset-0 w-full md:mt-0 h-6/10">
          <div className="flex h-fit w-full md:max-w-90 justify-end  md:h-120 items-start">
            <h1
              id="bytesized-regular"
              className="flex h-fit w-fit justify-end text-green-600"
            >
              yxy
            </h1>
          </div>
          <div className="flex h-fit w-full md:max-w-90 justify-end  md:h-120 items-end">
            <h1
              id="bytesized-regular"
              className="flex h-fit w-fit justify-end text-green-500"
            >
              xyz
            </h1>
          </div>

        </div>
      </div>
    );
}

// export default function SectionCard({ id, ref }: FancyTopProps) {
//   return (
//     <div
//       ref={ref}
//       id={id}
//       className="cursor-default w-full relative scroll-mt-30 mx-auto h-dvh max-w-2xl overflow-visible md:max-w-5xl"
//     >
//       <div
//         id="topSketch"
//         className="flex justify-center absolute inset-0 w-full h-full"
//       ></div>
//       <div className="flex flex-col lg:flex-row absolute inset-0 w-full h-full items-center lg:items-start justify-center lg:justify-between gap-4">
//         <h1
//           id="bytesized-regular"
//           className="text-green-600 text-center lg:text-left"
//         >
//           yxy
//         </h1>
//         <h1
//           id="bytesized-regular"
//           className="text-green-500 text-center lg:text-right"
//         >
//           xyz
//         </h1>
//       </div>
//     </div>
//   );
// }

