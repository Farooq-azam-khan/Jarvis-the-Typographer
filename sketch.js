let text_col; 
let r0; 
let r1; 
let r2; 
let r3;
let recs;  
let neural_jarvais; 

function setup() {
  makeCanvas();   
}

function draw()
{
  noLoop(); 
}

function mouseClicked() {
  background(255);
  recordData(mouseX, mouseY); // record target for old rectangle
  
  // pick new colors
  pickTextColor(); 
  r0.pickColor(getRandomCol(), getRandomCol(), getRandomCol(), getRandomCol()); 
  r1.pickColor(getRandomCol(), getRandomCol(), getRandomCol(), getRandomCol()); 
  r2.pickColor(getRandomCol(), getRandomCol(), getRandomCol(), 255); 
  r3.pickColor(getRandomCol(), getRandomCol(), getRandomCol(), 255); 
  r0.draw(); 
  r1.draw(); 
  r2.draw(); 
  r3.draw(); 
  
  // predict for new colors
  predictJarvais(); 
}

function windowResized() {makeCanvas();}
function pickTextColor() {text_col = [getRandomCol(), getRandomCol(), getRandomCol(), 255];}

function makeCanvas() {
  createCanvas(windowWidth, windowHeight); 
  background(255);
  pickTextColor()  
  
  
  r0 = new Rectangle(10, 10, floor(width/2)-10, floor(height/2)-10);
  r1 = new Rectangle(floor(width/2), 10, floor(width/2)-10, floor(height/2)-10); 
  r2 = new Rectangle(10, floor(height/2), floor(width/2)-10, floor(height/2)-10);
  r3 = new Rectangle(floor(width/2), floor(height/2), floor(width/2)-10, floor(height/2)-10); 
  
  recs = [r0, r1, r2, r3]; 
  r0.pickColor(getRandomCol(), getRandomCol(), getRandomCol(), getRandomCol()); 
  r1.pickColor(getRandomCol(), getRandomCol(), getRandomCol(), getRandomCol()); 
  r2.pickColor(getRandomCol(), getRandomCol(), getRandomCol(), 255); 
  r3.pickColor(getRandomCol(), getRandomCol(), getRandomCol(), 255); 
  
  r0.draw(); 
  r1.draw(); 
  r2.draw(); 
  r3.draw(); 
  
  // define neural network
  // input: r,g,b,a of each rect and text (5*4=20)
  // output: r0,r1,r2,r3
  neural_jarvais = new NeuralNetwork(20, 10, 4); 
  predictJarvais();
  
}

function predictJarvais() {
    
  features = [text_col[0]/255, text_col[1]/255, text_col[2]/255, text_col[3]/255,
              r0.color[0]/255, r0.color[1]/255,r0.color[2]/255,r0.color[3]/255,
              r1.color[0]/255, r1.color[1]/255,r1.color[2]/255,r1.color[3]/255,
              r2.color[0]/255, r2.color[1]/255,r2.color[2]/255,r2.color[3]/255,
              r3.color[0]/255, r3.color[1]/255,r3.color[2]/255,r3.color[3]/255,
  ]
  
  let jarvais_predict = neural_jarvais.predict(features);
  jarvais_rect = jarvais_predict.indexOf(max(jarvais_predict)); 
  fill(255); 
  ellipse(recs[jarvais_rect].x+100, recs[jarvais_rect].y+100, 20, 20)  
  
}

function trainJarvais(features, targets) {
  neural_jarvais.train(features, targets); 
}

function getRandomCol() {
  return  floor(random(255));
}

function recordData(mx, my) {
  // r0: 1, 0, 0, 0
  // r1: 0, 1, 0, 0
  // r2: 0, 0, 1, 0
  // r3: 0, 0, 0, 1
  
  let targets = [1, 0, 0, 0]
  let features = [text_col[0]/255, text_col[1]/255, text_col[2]/255, text_col[3]/255,
              r0.color[0]/255, r0.color[1]/255,r0.color[2]/255,r0.color[3]/255,
              r1.color[0]/255, r1.color[1]/255,r1.color[2]/255,r1.color[3]/255,
              r2.color[0]/255, r2.color[1]/255,r2.color[2]/255,r2.color[3]/255,
              r3.color[0]/255, r3.color[1]/255,r3.color[2]/255,r3.color[3]/255,
  ]  
  
  if (r0.intersectPoint(mx, my))
  {
    // console.log('intersects r0'); 
    targets = [1, 0, 0, 0];
  }
  else if (r1.intersectPoint(mx, my))
  {
    // console.log('intersects r1'); 
    targets = [0, 1, 0, 0];
  }
  else if (r2.intersectPoint(mx, my))
  {
    // console.log('intersects r2');     
    targets = [0, 0, 1, 0];
  }
  else if (r3.intersectPoint(mx, my))
  {
    // console.log('intersects r3');
    targets = [0, 0, 0, 1];
  }
  
  trainJarvais(features, targets);  
}

class Rectangle {
  constructor(x, y, width, height) {
    this.x = x; 
    this.y = y; 
    this.width = width; 
    this.height = height; 
  }
  pickColor(r, g, b, a) {
    this.color = [r, g, b, a]; 
  }
  draw() {
    fill(this.color[0], this.color[1], this.color[2], this.color[3]);
    rect(this.x, this.y, this.width, this.height);
    fill(text_col[0], text_col[1], text_col[2], text_col[3]); 
    textSize(100);
    text('hi', this.x+floor(width/10), this.y+100);
  }
  intersectPoint(x, y) {
    return ((this.x<=x&&this.y<=y)&&((this.x+this.width)>=x&&(this.y+this.height)>=y)); 
  }
  toString() {
    return `Rectangle {x:${this.x},y:${this.y},width:${this.width}, height:${this.height}}`; 
  }
}