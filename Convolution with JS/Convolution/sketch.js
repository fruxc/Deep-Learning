let img;
let w = 80;

// It's possible to convolve the image with many different
// matrices to produce different effects. This is a high-pass
// filter; it accentuates the edges.
const matrix = [
  [-1, -1, -1],
  [-1, 10, -1],
  [-1, -1, -1],
];

function preload() {
  img = loadImage("assets/test2.jpg");
}

function setup() {
  createCanvas(img.width, img.height);
  img.loadPixels();

  // pixelDensity(1) for not scaling pixel density to display density
  // for more information, check the reference of pixelDensity()
  pixelDensity(1);
}

function draw() {
  // We're only going to process a portion of the image
  // so let's set the whole image as the background first
  background(img);

  // Calculate the small rectangle we will process
  const xStart = constrain(mouseX - w / 2, 0, img.width);
  const yStart = constrain(mouseY - w / 2, 0, img.height);
  const xEnd = constrain(mouseX + w / 2, 0, img.width);
  const yEnd = constrain(mouseY + w / 2, 0, img.height);
  const matrixSize = 3;

  loadPixels();
  // Begin our loop for every pixel in the smaller image
  for (let x = xStart; x < xEnd; x++) {
    for (let y = yStart; y < yEnd; y++) {
      let c = convolution(x, y, matrix, matrixSize, img);

      // retrieve the RGBA values from c and update pixels()
      let loc = (x + y * img.width) * 4;
      pixels[loc] = red(c);
      pixels[loc + 1] = green(c);
      pixels[loc + 2] = blue(c);
      pixels[loc + 3] = alpha(c);
    }
  }
  updatePixels();
}

function convolution(x, y, matrix, matrixSize, img) {
  let rTotal = 0.0;
  let gTotal = 0.0;
  let bTotal = 0.0;
  const offset = Math.floor(matrixSize / 2);
  for (let i = 0; i < matrixSize; i++) {
    for (let j = 0; j < matrixSize; j++) {
      // What pixel are we testing
      const xLoc = x + i - offset;
      const yLoc = y + j - offset;
      let loc = (xLoc + img.width * yLoc) * 4;

      // Make sure we haven't walked off our image, we could do better here
      loc = constrain(loc, 0, img.pixels.length - 1);

      // Calculate the convolution
      // retrieve RGB values
      rTotal += img.pixels[loc] * matrix[i][j];
      gTotal += img.pixels[loc + 1] * matrix[i][j];
      bTotal += img.pixels[loc + 2] * matrix[i][j];
    }
  }
  // Make sure RGB is within range
  rTotal = constrain(rTotal, 0, 255);
  gTotal = constrain(gTotal, 0, 255);
  bTotal = constrain(bTotal, 0, 255);

  // Return the resulting color
  return color(rTotal, gTotal, bTotal);
}
