/** 
 * Driver script for the minesweeper app
 */

function Mine(i, j, w) {
    this.i = i; 
    this.j = j; 
    this.x = i*w; 
    this.y = j*w; 
    this.w = w; 
    this.nbs = 0; // nearby mines 
    if (random(1) < 0.2) { this.boom = true; } 
    else { this.boom = false; } 
    this.clicked = false;
  }
  
  Mine.prototype.click = function() {
    stroke(0); 
    noFill(); // default is empty 
    rect(this.x, this.y, this.w, this.w);
    if (this.x == 0 && this.y != 0) {
        text(this.j, this.x + (.3*this.w), this.y + (.7*this.w));
    }
    if (this.y == 0) {
        text(this.i, this.x + (.3*this.w), this.y + (.7*this.w));
    } 
    if (this.clicked) {
      if (this.boom) {
        // fill('red');
        // square(this.x+(0.4*w), this.y+(0.4*w), this.w * 0.3);
        text('\u{1F4A5}', this.x + (.5*this.w), this.y + (.7*this.w) ) 
      }
      else {
        if (this.nbs == 0) {
          for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
              if (this.i+i >= 1 && this.i+i < rows && this.j+j >= 1 && this.j+j < cols) {
                let nb = grid[this.i+i][this.j+j]; 
                if (!nb.boom) { nb.show(); } 
              }
            }
          }
        } 
        fill(200);
        rect(this.x, this.y, this.w, this.w);
        textAlign(CENTER); 
        fill(0);
        if (this.nbs == 0) { return; } 
        text(this.nbs, this.x + (.5*this.w), this.y + (.7*this.w)); 
      }
    }
  }
  
  Mine.prototype.contains = function(x, y) {
    if (x < this.x + w && x > this.x && this.y < y && y < this.y + this.w) {
      return true; 
    }
    return false;
  }
  
  Mine.prototype.show = function() {
    this.clicked = true;
  }
  
  Mine.prototype.getNeighbors = function() {
    if (this.boom) { return -1; }
    // loop through neighbors 
    let total = 0; 
    for (var i = -1; i <= 1; i++) {
      for (var j = -1; j <= 1; j++) {
        if (this.i+i >= 1 && this.i+i < rows && this.j+j >= 1 && this.j+j < cols) {
          let nb = grid[this.i+i][this.j+j]; 
          if (nb.boom) { total++;} 
        }
      }
    }
    this.nbs = total; 
  }
  
  function makeMatrix(r, c) {
    let A = new Array(r); 
    for (let i = 0; i < r; i++) {
      A[i] = new Array(c); 
    }
    return A; 
  }
  
  var grid; 
  var rows; 
  var cols; 
  var w = 20; 
  
  
  function setup() {
    createCanvas(420, 420).parent('frame'); // we need to identify the html holder 
    cols = floor(width / w); 
    rows = floor(height / w); 
    grid = makeMatrix(rows, cols); 
    for (let i = 1; i < rows; i++) {
      for (let j = 1; j < cols; j++) {
        grid[i][j] = new Mine(i, j, w); 
      }
    }
    for (let i = 1; i < rows; i++) {
      for (let j = 1; j < cols; j++) {
        grid[i][j].getNeighbors(); 
      }
    }
    //noLoop(); 
  }
  
  function mousePressed() {
    for (let i = 1; i < rows; i++) {
      for (let j = 1; j < rows; j++) {
        if (grid[i][j].contains(mouseX, mouseY)) {
          if (grid[i][j].boom) { gameOver(); } 
          grid[i][j].show()
        }
      }
    }
  }
  
  function draw() {
    background(255);
    for (let i = 1; i < rows; i++) {
      for (let j = 1; j < cols; j++) {
        grid[i][j].click(); 
      }
    }
    var url = '/gettarget'
    loadJSON(url, testFunc);  
  }
  
  function testFunc(data) {
    if (data.target_i !== 'null' && data.target_j !== 'null') {
      let i = Number(data.target_i); let j = Number(data.target_j); 
      if (i < rows && j < cols && i >= 1 && j >= 1) {
        if (grid[i][j].boom) { gameOver(); }
        grid[i][j].show(); 
      }
    }
  }
  
  function resetBoard() {
    for (let i = 1; i < rows; i++) {
      for (let j = 1; j < cols; j++) {
        grid[i][j].clicked = false; 
      }
    } 
  }
  
  function gameOver() { 
    for (let i = 1; i < rows; i++) {
      for (let j = 1; j < cols; j++) {
        grid[i][j].clicked = true; 
      }
    }
  }
  
  function hardRestart(data) {
    console.log(data);
    clear(); 
  }
  