type SectionProps = {
  id:string;
  title: string;
  content?: string;
};

export default function Section({ id, title, content }: SectionProps){
    return(
        <section key={id} className="max-w-4xl mx-auto z-2">
          <h2 className="text-2xl font-semibold mb-4">{title}</h2>
          <p>{content}</p>
        </section>
    )
}