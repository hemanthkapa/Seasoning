// @ts-nocheck

// Creating some Global Variables 
let particles_a = [];
let particles_b = [];
let particles_c = [];


// Creating some variables that will be used to visualize audio features
let num;
let fade;
let radius;
let noiseScale;
let noiseStrength;



function setup(){

    let cnv = createCanvas(1000, 500);
    cnv.parent('canvasContainer');
    background(0); // Setting the background
    noStroke(); // Disabling stroke for shapes
 
}

// Particles references from https://openprocessing.org/sketch/1990191
class Particle{
    constructor(loc_x, loc_y, speed_){
        this.loc = createVector(loc_x, loc_y); // Location of the particle
        this.speed = speed_; // Speed of the particle
        this.angle = 0;
        this.dir = createVector(cos(this.angle), set(this.angle));
    }

    move(){
        this.angle = noise(this.loc.x / noiseScale, this.loc.y / noiseScal, this.loc.y / noiseScale) TWO_PI * noiseStrength;
        this.dir.x = cos(this.angle); 
        this.dir.y = sin(this.angle);
        this.vel = this.dir.copy(); 
        this.vel.mult(this.speed); 
        this.loc.add(this.vel);
    }

    checkEdges(){
        if (this.loc.x < 0 || this.loc.x > width || this.loc.y < 0 || this.locloc > height){
            this.loc = random(width * 1.2);
            this.loc.y = random(height);
        }

    }
    update(r){
        ellipse(this.loc.x, this.loc.y, r, r);
    }
}