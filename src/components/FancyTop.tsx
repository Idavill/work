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
        <div className="fixed left-10 hidden lg:flex h-5/10 w-10 ">
          <h2
          id="bytesized-medium"
          className={`flex text-progress rotate-180`}
          >
            {currentSection}
          </h2>
        </div>

        {/* position and size live in index.css under #topSketch, not here:
            the box is centred on the viewport with a calc over the
            --sketch-* / --hero-top dials, which no utility can express. */}
        <div
          id="topSketch"
          className="flex justify-center items-center"
        >
          {/* the card behind the face. the p5 canvas is transparent so the
              particle background shows straight through the kaomoji, which is
              what made it hard to read — this gives it the same ground the
              project cards sit on: bg-canvas, one hairline of border-line,
              the hard offset shadow. drop shadow-hard for a flat panel.

              it has no size of its own. topSketch.js measures the face's
              actual on-screen bounds (which move with the viewport AND with
              the theme, since each theme sets its own --sketch-face) and
              writes width/height onto this element, so the card always hugs
              whatever face is up. aria-hidden + pointer-events-none: it is
              pure decoration sitting under a decorative canvas. */}
          {/* <div
            id="sketchPanel"
            aria-hidden="true"
            // className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none border border-line bg-canvas rounded-none shadow-hard"
            className="p-80 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:mb-0 w-full h-auto md:h-[clamp(440px,55vh,740px)] bg-canvas transition-colors duration-600 backdrop scroll-mt-[25vh] mx-auto max-w-lg overflow-hidden border border-line rounded-none shadow-hard md:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl z-0"
          ></div> */}
        </div>
      </div>
    );
}

