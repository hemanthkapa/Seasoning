// @ts-nocheck
import config from "./config";

// Creating some Global Variables 
let particles_a = [];
let particles_b = [];
let particles_c = [];

let systemInitialized = false; 

// Creating some variables that will be used to visualize audio features
let num;
let fade;
let radius;
let noiseScale;
let noiseStrength;

// Spotify Token Variables
let token;
let audioFeatures;

// Get Spotify API credentials from config.js
const clientId = config.spotify.clientId;
const clientSecret = config.spotify.clientSecret;

// Spotify API Authorization
const authOptions = {
    method: 'POST',
    header: {
        'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
}


function setup(){

    let cnv = createCanvas(1000, 500);
    cnv.parent('canvasContainer');
    background(0); // Setting the background
    noStroke(); // Disabling stroke for shapes

    // Fetch Spotify access token
    fetch('https://accounts.spotify.com/api/token', authOptions)
    .then(response => response.json()) // Parsing the JSON response
    .then(data => {
        token = data.access_token;
    })
    .catch(error => {
        console.error('Error fetching Spotify token:', error);

    })
 
}

function setupParticle(){

    if(!audioFeatures) {
        return;
    }

    //Reset th particles array everytime a new track has been introduced
    particles_a = [];
    particles_b = [];
    particles_c = [];

    // Selected audio features to be visualized (energy, duration_ms, loudness, danceability, and tempo)
    num = map(audioFeatures.energy, 0, 1, 500, 2000);
    fade = map(audioFeatures.duration_ms, 0, 360000, 50, 150);
    radius = map(audioFeatures.loudness, -60, 0, 1, 5);
    noiseScale = map(audioFeatures.danceability, 0, 1, 200, 400);
    noiseStrength = map(audioFeatures.tempo, 60, 180, 0.5, 2);


    // Creates 3 particle objects at random places and maps the speed based on the energy of the audio track
    for (let i = 0; i < num; i++) {
        particles_a[i] = new Particle(random(width), random(height), map(audioFeatures.energy, 0, 1, 0.05, 3));
        particles_b[i] = new Particle(random(width), random(height), map(audioFeatures.energy, 0, 1, 0.05, 3));
        particles_c[i] = new Particle(random(width), random(height), map(audioFeatures.energy, 0, 1, 0.05, 3));
    }

    systemInitialized = true;

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
        this.angle = noise(this.loc.x / noiseScale, this.loc.y / noiseScal, this.loc.y / noiseScale) * TWO_PI * noiseStrength;
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

function draw(){

    //Particles are drwn if the system has been initialized
    if(!systemInitialized){
        return;
    }

    // Fading effect referenced from (https://openprocessing.org/sketch/1990191)
    fill(0, 5);
    rect(0, 0, width, height);

    // Uses HSB color mode for more vibrant colors
    colorMode(HSB);

    // Maps different audio features to color components
    let baseHue = map(audioFeatures.valence, 0, 1, 0, 360); // Base hue from valence
    let saturationA = map(audioFeatures.energy, 0, 1, 50, 100); // Taking Saturation from energy
    let brightnessB = map(audioFeatures.danceability, 0, 1, 50, 100); // Taking Brightness from danceability

    // Creates distinct colors for each particle system
    let colorA = color(baseHue, saturationA, 90); // Color A is influenced by valence and energy
    let colorB = color((baseHue + 120) % 360, 80, brightnessB); // Color B is influenced by hue shift and danceability
    let colorC = color((baseHue + 240) % 360, 70, 80); // Color C is influenced by another hue shift

    for (let i = 0; i < num; i++) {
        fill(colorA);
        particles_a[i].move();
        particles_a[i].update(radius);
        particles_a[i].checkEdges();

        fill(colorB);
        particles_b[i].move();
        particles_b[i].update(radius);
        particles_b[i].checkEdges();

        fill(colorC);
        particles_c[i].move();
        particles_c[i].update(radius);
        particles_c[i].checkEdges();
    }

    colorMode(RGB);
}
