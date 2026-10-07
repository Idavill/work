type FooterProps={
  selectedProject:boolean;
}

export default function Footer({selectedProject}:FooterProps) {
  return (
    <>
    {!selectedProject && (
        <footer className="border-t-1 text-center bg-canvas text-ink p-4 text-sm z-3">
          &copy; {new Date().getFullYear()} All rights reserved.
        </footer>
      )
    }
    </>
  );
}