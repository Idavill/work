import Tag from "./Tag";

type ContentType ={
  degree:string;
  university:string;
  year:string;
}

type EducationProps = {
  ref: any;
  title: string;
  id?: string;
  content: ContentType[];
  image?: string;
  skills?: string[];
  softSkills?: string[];
  topics?: string[];
};

export default function SectionCard({ title, id, content, skills,softSkills,ref,topics }: EducationProps){
  return(
      <>
      <div ref={ref} id={id} className="mt-25 cursor-default hover:bg-blend-multiply backdrop-blur-2xl backdrop scroll-mt-30 mx-auto max-w-lg overflow-hidden rounded-xl  shadow-md md:max-w-4xl z-2">
          <div className="md:flex">
            <div className="md:shrink-0">
            </div>
            <div className="p-8">
              <section className="max-w-4xl mx-auto z-2">
                <h2 className="text-2xl font-semibold mb-4">{title}</h2>

                <div className="collapse bg-base-100 border border-base-300">
                  <input type="radio" name="my-accordion-1" />
                  <div className="collapse-title font-semibold">I forgot my password. What should I do?</div>
                  <div className="collapse-content text-sm">Click on "Forgot Password" on the login page and follow the instructions sent to your email.</div>
                </div>
                {content.map((c) => (
                    <div className="flex flex-row  rounded-l-4xl max-w-50 md:max-w-250 pb-2 pt-2 pl-10">
                      <p className="w-30 hover:bg-emerald-700">{c.year}</p>
                      <div className=" flex flex-col w-200">
                        <p>{c.degree}</p>
                        <p>{c.university}</p>
                      </div>
                    </div>
                  ))
                }
              
              </section>
              { topics &&
              <div className="mt-4 flex flex-wrap gap-2 flex-end">
                {topics.map((t) => (
                <p>{t} | </p>
                ))}
              </div>
              }
              { skills &&
              <div className="mt-4 flex flex-wrap gap-2 flex-end">
                {skills.map((t) => (
                <Tag key={t} tag={t}></Tag>
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