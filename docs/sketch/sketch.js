let pageHeight = 1000;
let pageWidth = 100;
let isReady = true;
let canvas4;
let mousePressed = false;
let particles = [];
let img;

particlebackground = function (p) {
  let particles = [];
  let res = 50;
  p.preload = function () {
    img = p.loadImage("/work/images/6-small.jpg");
    pageHeight = p.select("body").height;
    pageWidth = p.select("body").width;
    img.resize(pageWidth, pageHeight);
  };
  p.setup = function () {
    // pageHeight = p.select("body").height;
    // pageWidth = p.select("body").width;
    canvas4 = p
      .createCanvas(pageWidth, pageHeight)
      .parent("pfive-container-background");
    canvas4.position(0, 0);
    canvas4.style("z-index", "1");
    p.noStroke();
    // paintParticles();
    // img.resize(pageWidth, pageHeight); // pageHeight
  };
  p.draw = function () {
    paintParticles();
  };
  paintParticles = function () {
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    if (isReady) {
      placeParticles();
      canvas4.style("opacity", "1");
      isReady = false;
    }
  };
  p.windowResized = function () {
    resizeTimeout = setTimeout(() => {
      clearAllParticles();
      isReady = true;
      pageHeight = p.select("body").height;
      pageWidth = p.select("body").width;
      p.resizeCanvas(pageWidth, pageHeight);
      if (img !== undefined) {
        img.resize(pageWidth, pageHeight);
      }
      paintParticles();
      console.log("window resized and particles repainted!");
    }, 300); // Adjust delay as needed
  };

  function clearAllParticles() {
    particles = [];
  }
  function placeParticles() {
    for (let i = 0; i < p.width; i += res) {
      for (let j = 0; j < p.height; j += res) {
        let x = (i / p.width) * img.width;
        let y = (j / p.height) * img.height;
        let c = img.get(x, y);

        if (c[0] + c[1] + c[2] != 255 * 3) {
          particles.push(
            new Particle(
              p,
              i, //+ p.noise(i * 100, j * 100) * 10,
              j, //+ p.noise(-i * 100, -j * 100) * 10,
              c,
              res
            )
          );
        }
      }
    }
  }

  class Particle {
    constructor(p, x, y, color, res) {
      this.res = res;
      this.p = p;
      this.x = x;
      this.y = y;

      this.homeX = x;
      this.homeY = y;

      this.color = color;

      // Add random velocity
      this.vx = this.p.random(-10, 2);
      this.vy = this.p.random(-10, 2);
    }

    fly() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < 0 || this.x > this.p.width) this.vx *= -1;
      if (this.y < 0 || this.y > this.p.height) this.vy *= -1;
    }

    shuffle() {
      this.x = this.p.random(this.p.width);
      this.y = this.p.random(this.p.height);
    }

    update() {
      this.fly();
      // mouse
      let mouseD = this.p.dist(this.x, this.y, this.p.mouseX, this.p.mouseY);
      let mouseA = this.p.atan2(this.y - this.p.mouseY, this.x - this.p.mouseX);
      // let mouseD = this.p.dist(this.x, this.y, 1, 1);
      // let mouseA = this.p.atan2(1, 1);

      // home
      let homeD = this.p.dist(this.x, this.y, this.homeX, this.homeY);
      let homeA = this.p.atan2(this.homeY - this.y, this.homeX - this.x);
      // forces
      let mouseF = this.p.constrain(this.p.map(mouseD, 0, 200, 10, 0), 0, 10);
      //console.log(mouseF);
      //let mouseF = this.p.map(mouseD, 0, 100, 10, 0);
      let homeF = this.p.map(homeD, 0, 100, 0, 10);

      let vx = this.p.cos(mouseA) * mouseF * 2;
      vx += this.p.cos(homeA) * homeF;

      let vy = this.p.sin(mouseA) * mouseF * 2;
      vy += this.p.sin(homeA) * homeF;

      this.x += vx;
      this.y += vy;
    }

    draw() {
      this.p.fill(this.color);
      this.p.ellipse(this.x, this.y, this.res, this.res);
    }
  }
};

new p5(particlebackground);
