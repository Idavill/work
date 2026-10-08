// the host box for sketch/cornerCube.js. react owns where it sits, p5 owns
// what is drawn in it — the sketch finds this div by id and parents its canvas
// to it, so this component renders nothing itself.
//
// the position started as the ThemeToggle's — fixed bottom-6 right-6, h-14
// w-14 — and has since grown: h-20 w-20 for a bigger cube, bottom-10 right-10
// to stand it further off the corner. z-4 clears main's z-2 so it stays
// clickable over an open project modal.
//
// the box is the size dial. the cube is drawn at a fraction of whichever side
// is smaller (SIZE in the sketch), so widening this widens the cube with it —
// and the sketch re-reads the box on resize, so the two cannot drift apart.
//
// no onClick here. the canvas fills this div and handles its own press inside
// the sketch, which keeps the interaction in one file. if the click ever needs
// to drive something in react too, the sketch should dispatch a window
// CustomEvent — the pattern ThemeToggle already uses to shake the background.
export default function CornerCube() {
  return (
    <div
      id="cornerCube"
      // cursor-pointer is the only affordance it has: the cube is drawn to a
      // transparent canvas with no border or background, so without this there
      // is nothing to say it can be clicked.
      className="fixed bottom-10 right-10 z-4 h-30 w-30 cursor-pointer"
    />
  );
}
