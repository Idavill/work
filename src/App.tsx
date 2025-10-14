import Card from "./components/Card";
import SectionCard from "./components/SectionCard";
import FancyTop from "./components/FancyTop";
import aboutJson from "./post-content/About.json";
import contactJson from "./post-content/Contant.json";
import projects from "./post-content/ProjectsList.json";
import Modal from "./components/Modal";
import { useEffect, useRef, useState } from "react";
import type { ProjectType } from "./types/Types";
import Footer from "./composition/Footer";
import Header from "./composition/Header";
import ContactSectionCard from "./components/Contact";
import About from "./components/About/About";
import Projects from "./components/Projects";

function App() {
  const [currentSection, setCurrentSection] = useState("");
  const [selectedProject, setSelectedProject]= useState<ProjectType | null>(null);
  const [headerOpacity, setHeaderOpacity] = useState(0);
  let color = "text-cyan-200"
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  const topRef = useRef(null);

  useEffect(() => {
    const sections = [
      { ref: topRef, number: 0,title:"• • • *" },
      { ref: aboutRef, number: 1,title:"• • * •" },
      { ref: projectsRef, number: 2,title:"• * • •" },
      // { ref: educationRef, number: 3,title:"• * • • •" },
      { ref: contactRef, number: 4,title:"* • • •" },
    ];

    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const found = sections.find(s => s.ref.current === entry.target);
            if (found) setCurrentSection(found.title);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => {
      if (section.ref.current) observer.observe(section.ref.current);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selectedProject != null) {
      document.body.classList.add("overflow-y-hidden");
    } else {
      document.body.classList.remove("overflow-y-hidden");
    }
  }, [selectedProject]);

  useEffect(() => {
    const handleScroll = () => {
      const start = 40; // scroll position where fade starts
      const end = 300;  // scroll position where fade ends
      const y = window.scrollY;
      let opacity = 0;
      if (y > start) {
        opacity = Math.min((y - start) / (end - start), 1);
      }
      setHeaderOpacity(opacity);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`${color} grid grid-rows-[auto_1fr_auto] min-h-screen min-w-screen bg-amber-700 z-3 `}>
      <div className={`fixed inset-0 ${selectedProject? "backdrop-grayscale blur-xl" : "backdrop-hue-rotate-280 blur-sm"} z-2`} />
      <Header headerOpacity={headerOpacity} selectedProject={!!selectedProject}/>
      <main className="flex p-10 place-content-around z-2">
        <div className="flex flex-col w-100 md:w-200 lg:w-300">
          <div className={`${selectedProject!=null? "blur-xl grayscale":""}`}>
            <div id="p5_loading" className="loadingclass">
            this could be some sweet graphics loading lots of bits.
            <span className="loading justify-center loading-dots loading-xl absolute z-20"></span>
          </div>
        <FancyTop ref={topRef} title={"FancyTop"} id="top" selectedProject={!!selectedProject} currentSection={currentSection}/>
        <About ref={aboutRef} title={"IDA VILLADSEN"} id="about" topics={aboutJson.topics} content={aboutJson.content}/>
        <Projects ref={projectsRef} title={"PROJECTS"} id="projects" skills={projects.skills} content={projects.content}/>
          {projects.projects.map((project) => (
            <Card
              key={project.id}
              project={project}
              open={!!selectedProject && selectedProject!= null && selectedProject.id === project.id}
              setOpen={(open) => setSelectedProject(open ? project : null)}
            />
          ))}
          <div className="mb-100"/> {/*buffer between contact and projects*/}
        <ContactSectionCard ref={contactRef} title={"CONTACT ME"} id="contact" content={contactJson.content}/>
        </div>
        {selectedProject && (
          <Modal
            project={selectedProject}
            open={true}
            setOpen={() => setSelectedProject(null)}>
          </Modal>
        )}
        </div>
      </main>

      <Footer selectedProject={!!selectedProject}/>
    </div>
  );
}

export default App;
