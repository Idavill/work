import { GrAdd } from "react-icons/gr";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useState } from "react";
import SharpiSection from "./SharpiSection";
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
  let linkHoverColor = "hover:border-white ";

    return(
      <div className="h-dvh">
      <div ref={ref} id={id} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      className="cursor-default h-90 w-full hover:bg-blend-multiply backdrop-blur-2xl backdrop scroll-mt-[25vh] mx-auto max-w-lg overflow-hidden rounded-xl  shadow-md md:max-w-4xl z-2">
          <div className="md:flex">
            <div className="md:shrink-0">
            </div>
            <div className="flex flex-col w-full justify-between p-8 h-90">
              <div className="flex opacity-0 text-gray-400 flex-row justify-between">
                <Bs3Circle className="flex self-end"/>
                <p>Contact</p>
              </div>
              <h2 className={`text-5xl border-b-2 ${hover? "border-cyan-200" : "border-transparent" } w-fit  font-semibold mb-4`}>{title}</h2>
              <div className="flex flex-col md:flex-row">
                <GrAdd className="flex w-1/6 mb-5"/>
                <div className="flex flex-col pl-0 md:pl-5 w-full md:w-5/6">
                  {/* <p className="flex break-words w-full" >Below you can explore an array of my</p> */}


                  <SharpiSection
                    text={`Feel free to reach me through LinkedIn or GitHub`}
                    backgroundSize={`${hover ? "100% 100%" : "0% 100%"}`}
                  />
                  <p className="flex break-words" >to connect or collaborate.</p>
                </div>
              </div>
              <div className="flex flex-row">
                {/* <GrAdd className="flex w-2/6"/> */}
                <div className="flex w-1/6"/>
                <div className="flex w-5/6">
                <div className="pl-5 contact-links flex flex-row justify-center gap-4">
                  <a href="https://linkedin.com/in/ida-maria-villadsen-a9954212a" target="_blank" rel="noopener noreferrer" className={`${linkTextColor} ${linkHoverColor} flex items-center gap-2`}>
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