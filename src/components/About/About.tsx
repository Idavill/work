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
        className="cursor-default md:mb-0 w-full h-220 md:h-[clamp(440px,55vh,740px)] hover:bg-hover transition-colors duration-600 backdrop-blur-2xl backdrop scroll-mt-[25vh] mx-auto max-w-lg overflow-hidden border border-line rounded-none shadow-hard md:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl z-2">
          <div className="md:flex h-full">
            <div className="md:shrink-0"/>
            <div className="flex flex-col justify-around p-8 xl:p-12 h-full">
              <div className="flex opacity-0 flex-row justify-between">
                <Bs1Circle className="flex self-end"/>
                <p>About</p>
              </div>
              <h2
                className={`text-4xl xl:text-5xl 2xl:text-6xl border-b-2 ${hover? "border-line" : "border-transparent" } w-fit font-semibold mb-4`}
              >
                  {title}
              </h2>
              <TopDescription/>
              {/* two layouts, one per state, so neither has to compromise:

                  stacked (below md) it is a plain flex column — each block is
                  its own content height with gap-6 between them. an earlier
                  auto-rows-fr grid equalised these rows too, which stretched the
                  short tag row and left a void above the headlines.

                  side by side (md+) it is a 6-column grid split 1/2/3, the same
                  ratio the old sixths-based widths gave. one row, so cells are
                  equal height by stretch; MiniHeadlines then takes itself out of
                  flow (see its comment) so the tag stack is what sizes the row
                  and both columns end on the same line.

                  the leading spacer is only the md+ indent, hence hidden while
                  stacked, where ps-0 applies instead. */}
              <div className="flex flex-col gap-6 pt-6 md:grid md:grid-cols-6 md:gap-0 md:ps-6 ps-0">
                <div className="hidden md:block md:col-span-1"/>
                    <SkillList topics={topics}/>
                    <MiniHeadlines/>
                </div>
            </div>
        </div>
      </div>
      </div>
    );
}