import { GrAdd } from "react-icons/gr";
import PaperTag from "../PaperTag";
import SharpiSection from "../SharpiSection";

type TopDescriptionType = {
    hover: boolean,
}

export default function TopDescription({hover}:TopDescriptionType){
    return(
        <>
              <div className="flex h-fit md:h-fit md:flex-row flex-col gap-x-5 ">
                <GrAdd className="flex w-1/6 mb-5 md:mb-0"/>
                <div className="flex w-full h-fit flex-col md:w-5/6">
                  <SharpiSection
                    text={`Software developer with a playful design mindset <3`}
                    backgroundSize={`${hover ? "100% 100%" : "0% 100%"}`}
                  />
                  <p className="flex break-words w-full" >{`Passionate about building intuitive tools and user experiences, exploring creative technologies in the intersection of technology and design`}</p>
                </div>
              </div>
        </>
    )
}