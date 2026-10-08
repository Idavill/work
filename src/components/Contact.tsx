import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useState } from "react";
import { Bs3Circle } from "react-icons/bs";

type ContactProps = {
  ref: any;
  title: string;
  id?: string;
  content?: string;
  image?: string;
  skills?: string[];
  softSkills?: string[];
  topics?: string[];
};

export default function Contact({ title, id, ref }: ContactProps){
  const [hover,setHover] = useState(false);
  let linkTextColor = "border-b-2 border-transparent";
  let linkHoverColor = "hover:border-line ";

    return(
      <div className="min-h-dvh flex items-center justify-center py-10">
      <div ref={ref} id={id} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      // inherits down to the h2, the blurb and the LinkedIn/GitHub links,
      // which set no colour of their own
      className="hover:text-card-accent cursor-default h-auto md:h-[clamp(260px,33vh,410px)] w-full hover:bg-hover transition-colors duration-600 bg-canvas backdrop scroll-mt-[25vh] mx-auto max-w-lg overflow-hidden border border-line rounded-none  shadow-hard md:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl z-2">
          <div className="md:flex h-full">
            <div className="md:shrink-0">
            </div>
            {/* p-8 below xl, matching About — was p-5. h-auto on mobile, so
                the extra padding grows the card rather than crowding the
                links at the bottom of it. */}
            <div className="flex flex-col w-full min-w-0 justify-around p-8 xl:p-12 h-full">
              <div className="flex opacity-0 text-muted flex-row justify-between">
                <Bs3Circle className="flex self-end"/>
                <p>Contact</p>
              </div>
              <h2 className={`text-4xl xl:text-5xl 2xl:text-6xl border-b-2 ${hover? "border-line" : "border-transparent" } w-fit  font-semibold mb-4`}>{title}</h2>
              <div className="flex flex-col md:flex-row">
                {/* same plus as About/TopDescription.tsx — a typed "+" rather
                    than the GrAdd icon, so it can carry the indicator's real
                    text-shadow. see that file for the why. */}
                <span
                  aria-hidden="true"
                  className="flex justify-center w-1/6 mb-5 text-6xl leading-none text-progress text-shadow-[0.07em_0.07em_0_var(--color-muted)]"
                >
                  +
                </span>
                <div className="flex flex-col pl-0 md:pl-5 w-full md:w-5/6">
                  {/* <p className="flex break-words w-full" >Below you can explore an array of my</p> */}

                 
                  <p className="flex break-words" >Feel free to reach me through LinkedIn or GitHub to connect and collaborate.</p>
                </div>
              </div>
              <div className="flex flex-row">
                {/* <GrAdd className="flex w-2/6"/> */}
                <div className="flex w-1/6"/>
                <div className="flex w-5/6">
                <div className="pl-5 contact-links flex flex-row justify-center gap-4">
                  <a href="https://www.linkedin.com/in/ida-villadsen-a9954212a/" target="_blank" rel="noopener noreferrer" className={`${linkTextColor} ${linkHoverColor} flex items-center gap-2`}>
                    <FaLinkedin /> LinkedIn
                  </a>
                  <a href="https://github.com/Idavill" target="_blank" rel="noopener noreferrer" className={`${linkTextColor} ${linkHoverColor}  flex items-center gap-2`}>
                    <FaGithub /> GitHub
                  </a>
                </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      </div>
    );
}