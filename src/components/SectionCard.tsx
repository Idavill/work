import Section from "./Section";
import Tag from "./Tag";

type SectionCardProps = {
  ref: any;
  title: string;
  id?: string;
  content?: string;
  image?: string;
  skills?: string[];
  softSkills?: string[];
  topics?: string[];
};

export default function SectionCard({ title, id, content, softSkills,ref,topics }: SectionCardProps){
    return(
      <>
      <div ref={ref} id={id} className="mt-25 cursor-default hover:bg-blend-multiply backdrop-blur-2xl backdrop scroll-mt-30 mx-auto max-w-lg overflow-hidden rounded-xl  shadow-md md:max-w-4xl z-2">
          <div className="md:flex">
            <div className="md:shrink-0">
            </div>
            <div className="p-8">
              <Section id={id+title} title={title} content={content}/>
              { topics &&
              <div className="mt-4 flex flex-wrap gap-2 flex-end">
                {topics.map((t) => (
                <p key={t}>{t} | </p>
                ))}
              </div>
              }
              { softSkills &&
              <div className="mt-4 flex flex-wrap gap-2 flex-end">
                {softSkills.map((t) => (
                <Tag key={t} tag={t}></Tag>
                ))}
              </div>
              }
            </div>
        </div>
      </div>
      </>
    );
}