import Button from "../components/Button"

type HeaderProps = {
  headerOpacity: number;
  selectedProject: boolean;
}

export default function Header({headerOpacity, selectedProject}: HeaderProps) {
    return(
    <>
        {!selectedProject && (
        <header
          className="flex flex-row place-content-around sticky top-0 z-4 p-4 transition-colors duration-300"
        >
          <div
            className="flexmd:w-fit justify-center rounded-3xl p-1"
            style={{
              boxShadow: headerOpacity > 0.2 ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
              // backdropFilter: headerOpacity > 0.2 ? "blur(16px)" : "none",
              backgroundColor: `rgba(20, 20, 20, ${headerOpacity})`,
          }}>
            <div className="flex flex-row justify-center place-content-around w-110 md:w-150 lg:w-150">
              <a href="#top"><Button name="↑" /></a>
              <a href="#about"><Button name="About" /></a>
              <a href="#projects"><Button name="Projects" /></a>
              {/* <a href="#education"><Button name="Experience" /></a> */}
              <a href="#contact"><Button name="Contact" /></a>
            </div>
          </div>
        </header>
        )}
    </>
    )
}