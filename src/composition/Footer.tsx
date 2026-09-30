type FooterProps={
  selectedProject:boolean;
}

export default function Footer({selectedProject}:FooterProps) {
  return (
    <>
    {!selectedProject && (
        <footer className="bg-surface text-center text-ink p-4 text-sm z-3">
          &copy; {new Date().getFullYear()} All rights reserved.
        </footer>
      )
    }
    </>
  );
}