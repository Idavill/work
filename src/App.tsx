import Card from "./components/Card";
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
import BackToTop from "./components/BackToTop";
import ThemeToggle from "./components/ThemeToggle";
import About from "./components/About/About";
import Projects from "./components/Projects";
// draggable fruit stickers — parked for now, uncomment this and the
// <Stickers /> render below to bring them back
// import Stickers from "./components/Stickers";

// type ImageMap = {
//   id: string,
//   images : string[]
// }

// type Images = {
//   list: ImageMap[]
// }

function App() {
  const [currentSection, setCurrentSection] = useState("");
  const [selectedProject, setSelectedProject]= useState<ProjectType | null>(null);
  const [headerOpacity, setHeaderOpacity] = useState(0);
  // const [preloadedImages, setPreloadedImages]= useState<Images | null>(null);
  let color = "text-ink"
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

  // flex-col, NOT grid-rows-[auto_1fr_auto]. a sticky element is clamped to its
  // containing block, and the containing block of a grid item is its GRID AREA
  // — the header sat in an `auto` row sized exactly to itself, so `sticky top-0`
  // had zero distance to travel and could never stick. the containing block of
  // a flex item is the flex container's content box, which is as tall as the
  // whole document, so the header can actually move. <main> carries flex-1 to
  // replace the 1fr row.
  // min-w-full, not min-w-screen: 100vw includes the scrollbar width, so it
  // forced a phantom horizontal scrollbar whenever one was showing.
  return (
    <div className={`${color} flex flex-col min-h-screen min-w-full bg-canvas z-3 `}>
      <div className={`fixed inset-0 ${selectedProject? "backdrop-grayscale blur-xl" : "blur-sm"} z-2`} />
      <Header headerOpacity={headerOpacity} selectedProject={!!selectedProject}/>
      {/* p-4 below md: p-10 ate 80px of a 393px phone viewport. and w-full,
          not w-100 — w-100 is a FIXED 400px, so on any phone the content column
          was already wider than the screen before padding, which is what makes
          iOS pan sideways and the whole mobile layout look wrong. the md+ fixed
          widths are fine, they only apply above 768px. */}
      {/* pt-24 replaces the flow space the header used to occupy, now that it
          is position:fixed. roughly header height + a little clearance, so the
          hero lands where it always did rather than jumping up under it. */}
      <main className="flex flex-1 p-4 pt-24 md:p-10 md:pt-28 place-content-around z-2">
        <div className="flex flex-col w-full md:w-200 lg:w-300 xl:w-[88vw] xl:max-w-[1600px]">
          <div className={`${selectedProject!=null? "blur-xl grayscale":""}`}>
            <div id="p5_loading" className="loadingclass">
            Loading..
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
          <div className="mb-20"/> {/*buffer between contact and projects*/}
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

      {/* hidden while a project modal is open so they don't float over it */}
      {/* {!selectedProject && <Stickers />} */}

      <Footer selectedProject={!!selectedProject}/>
      {/* <BackToTop selectedProject={!!selectedProject}/> */}
      {/* no selectedProject gate: the theme switcher stays reachable even with
          a project modal open */}
      <ThemeToggle />
    </div>
  );
}

export default App;
