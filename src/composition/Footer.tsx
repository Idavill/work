type FooterProps={
  selectedProject:boolean;
}

export default function Footer({selectedProject}:FooterProps) {
  return (
    <>
    {!selectedProject && (
        // snap-end, and it is load-bearing under the page's mandatory
        // snapping (see index.css). #contact is the last section target, so
        // without a point down here the browser would keep pulling back up to
        // it and the footer could never be reached at all. `end` rather than
        // `start` because the footer is only a line tall — aligning its TOP to
        // the top of the viewport would leave a screen of blank below it,
        // whereas aligning its bottom to the bottom rests the page exactly at
        // its natural end.
        <footer className="border-t-1 text-center bg-canvas text-ink p-4 text-sm z-3 snap-end">
          &copy; {new Date().getFullYear()} All rights reserved.
        </footer>
      )
    }
    </>
  );
}