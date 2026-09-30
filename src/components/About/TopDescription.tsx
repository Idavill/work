import { GrAdd } from "react-icons/gr";

export default function TopDescription(){
    return(
        <>
              <div className="flex h-fit md:h-fit md:flex-row flex-col gap-x-5 ">
                <GrAdd className="flex w-1/6 mb-5 md:mb-0"/>
                <div className="flex w-full h-fit flex-col md:w-5/6">
                  <p className="flex break-words w-full" >{`Software developer with a playful design mindset <3 Passionate about building intuitive tools and user experiences, exploring creative technologies in the intersection of design and technology`}</p>
                </div>
              </div>
        </>
    )
}