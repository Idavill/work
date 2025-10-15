type FooterProps={
  selectedProject:boolean;
}

export default function Footer({selectedProject}:FooterProps) {
  return (
    <>
    {!selectedProject && (
        <footer className="bg-gray-900 text-center text-white p-4 text-sm z-3">
          &copy; {new Date().getFullYear()} All rights reserved.
        </footer>
      )
    }
    </>
  );
}