import { useState } from "react";
import AppImage from "./AppImage";
import type { ImgType } from "../types/Types";

type CarouselProps = {
  images: ImgType;
  id?: string[];
};

export default function Carousel({ images }: CarouselProps) {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [hover, setHover] = useState(false);

  return (
    <div className="relative">
      <div
        className="carousel lg:rounded-l-xl lg:rounded-t-none rounded-t-xl overflow-x-hidden rounded-box w-full max-h-64 md:max-h-80 lg:max-h-200 flex snap-x snap-mandatory"
      >
        {images.main.map((img, index) => (
          <div
            id={`${index}`}
            key={`${img}${index}`}
            className="carousel-item overflow-hidden flex-shrink-0 snap-center w-full"
          >
            <AppImage id={`${index}${img}`} fallbackImage={images.fallback[index]} img={img} setHover={setHover}/>
          </div>
        ))}
      </div>
      {/* BUTTONS */} 
      <div
                      onMouseEnter={() => {
                // console.log("true");
                setHover(true);
              }}
        className={`absolute bottom-5 ${hover ? "opacity-100" : "opacity-0"} left-1/2 -translate-x-1/2 flex gap-3 bg-gray-950 rounded-4xl p-2 z-10`}
      >
        {images.main.map((_, index) => (
          <a key={index} href={`#${index}`}>
            <button
              onClick={() => setActiveButton(`#${index}`)}
              className={`rounded-full px-4 py-2 text-cyan-200 transition-all duration-200
                ${activeButton === `#${index}`
                    ? "bg-purple-700 text-white"
                    : "bg-transparent"
                } 
                hover:text-purple-400 active:text-purple-400
              `}
            >
              {index + 1}
            </button>
          </a>
        ))}
      </div>
    </div>
  );
}


// import { useState } from "react";

// type CarouselProps = {
//     images: string[];
//     id:string[];
// };

// export default function Carousel({ images }: CarouselProps) {
//   const [activeButton, setActiveButton] = useState<string | null>(null);
//   const [hover, setHover] = useState(false);

//   return (
//     <div>
//     {/* <div
//       onMouseEnter={()=>{console.log("true")}}
//       onMouseLeave={()=>{console.log("false")}}
//       className="w-fit h-fit bg-amber-400"/> */}
//     <div
//       className="carousel overflow-x-hidden rounded-box w-full max-h-64 sm:max-h-80 md:max-h-full flex snap-x snap-mandatory">

//       {images.map((img, index) => (
//         <div id={`${index}`}
//         key={img}
//         className="carousel-item overflow-hidden flex-shrink-0 snap-center w-full">
//           <img
//             className="w-full h-full object-cover"
//             onMouseEnter={()=>console.log("true")}
//             onMouseLeave={()=>console.log("false")}
//             src={img}
//             alt={img}
//           />
//         </div>
//       ))}
//         <div className="absolute self-end justify-around mb-5 w-fit bg-blue-700 rounded-4xl h-fit gap-2">
//         {images.map((img, index) => (
//         <a href={`#${index}`} className="btn rounded m-3 btn-m">
//           <button
//           key={`${index}`}
//           onClick={() => setActiveButton(`#${index}`)}
//           className={`rounded-3xl px-4 py-2 text-cyan-200 
//             ${hover? "opacity-0" : "opacity-100"}
//             ${activeButton === `#${index}` ? "bg-purple-700 text-white" : "bg-transparent"} 
//              hover:text-purple-400 active:text-purple-400
//             transition-all duration-200`}
//         >
//           <h2>{index}</h2>
//         </button>
//         </a>
//       ))}
//     </div>
//     </div>
//     </div>
//   );
// }