let generalMargin = 30;
let flat;
let textured_output;
let bungeeFont;
let color;
let amount = 100;

function s1(p) {
  p.preload = function () {
    // bungeeFont = p.loadFont("images/BungeeSpice-Regular.ttf");
    textured_output = p.loadModel(
      "/images/textured_output.obj",
      true,
      () => {
        console.log("Model loaded successfully");
      },
      (err) => {
        console.error("Error loading model:", err);
      }
    );
  };

  p.setup = function () {
    canvas1 = p.createCanvas(500, 500, p.WEBGL).parent("#topSketch");
    canvas1.style("display", "flex");
    p.pixelDensity(1);

    color = p.color(100, 0, 255);
  };
  p.draw = function () {
    p.background(240, 0, 200, 10);
    p.push();
    // p.ambientLight(10, 100, 220); // blue
    // p.ambientLight(170, 80, 40); // orange
    // p.ambientLight(10, 120, 120); // tyrkis
    p.ambientLight(10, 120, 150); // blue

    const angle = p.frameCount * 0.02;
    const lx = 150 * Math.cos(angle);
    const ly = 200 * Math.sin(angle);
    const lz = 100 * Math.sin(angle * 0.98);

    p.directionalLight(255, 20, 100, lx, ly, lz);

    // Draw your object
    p.sphere(200, 25, 25);
    p.pop();
  };
}

new p5(s1);
