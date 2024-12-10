import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

import { generateEllipticalGalaxy, generateIrregularGalaxy, generateSpiralGalaxy } from './galaxy.js';

/* Global variables */
let renderer, controls, scene, camera;
let eKey = false; // Tracks whether left click is being pressed
const clock = new THREE.Clock();

/* Sphere Parameters */
const SPHERE_PARAMS = {
    rotationSpeed: 0.5,
    color: '#ff0055',
    sphereSize: 0.005,
};

/* Particle Parameters */
const PARTICLE_PARAMS = {
    particleSpeed: 0.1,
    color: '#ffffff',
    particleSize: 0.005,
    count: 50000,
    branches: 3,
    radius: 5,
    galaxy: 0,
}

/* Three.js code */
scene = new THREE.Scene();
/* Camera setup */
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(0, 3, 6);

/* Create renderer and set up the canvas */
renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor(0x9a52a3, .15);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* Objects */
const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);



/* Materials */
const sphereMaterial = new THREE.PointsMaterial({
    size: SPHERE_PARAMS.sphereSize,
    color: SPHERE_PARAMS.color,
});

/* Meshes */
const sphere = new THREE.Points(sphereGeometry, sphereMaterial);
scene.add(sphere);

/* Skybox Implementation */
const skyboxGeometry = new THREE.SphereGeometry(500, 500, 500);
const skyboxTexture = new THREE.TextureLoader().load('./assets/skybox.jpg'); // NASA Credit for Image: https://svs.gsfc.nasa.gov/4851
const skyboxMaterial = new THREE.MeshBasicMaterial({map: skyboxTexture, side: THREE.BackSide, depthWrite: false});
const skyboxMesh = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
skyboxMesh.renderOrder = -1; // Load skybox first to prevent the particles from disappearing
scene.add(skyboxMesh);

/* Interaction */
controls = new OrbitControls(camera, renderer.domElement);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const mouse3D = new THREE.Vector3();
let coordsNear;

/* This event listener monitors when the 'e' key is pressed. */
window.addEventListener('keydown', function(event)  {
   if (event.key.toLowerCase() === 'e' && !eKey) {
       eKey = true;
       console.log("The 'e' key is being pressed.")
   }
});

/* This event listener monitors when the 'e' key is released. */
window.addEventListener('keyup', function(event) {
    if (event.key.toLowerCase() === 'e') {
       eKey = false;
       console.log("The 'e' key was released.")
   }
});

/* This event listener tracks the mouse movement of the user and, if the e key is held, creates a bubbling effect of the particles. */
window.addEventListener('mousemove', function(event) {
    if (eKey) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Assignment 3 implementation of "picking" to get mouse position from 2D to 3D
        coordsNear = new THREE.Vector3(mouse.x, mouse.y, 0);
        raycaster.setFromCamera(coordsNear, camera);
        var intersects = raycaster.intersectObject(invsplane);
        if (intersects.length > 0) {
            mouse3D.x = intersects[0].point.x;
            mouse3D.y = intersects[0].point.y;
            mouse3D.z = intersects[0].point.z;
        }
    }
});

/* This event listener handles any potential resizes the user may make.*/
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Implement invisible plane for mouse calculation similar to assignment 3 
const geometry = new THREE.PlaneGeometry(20, 20);
const material = new THREE.MeshBasicMaterial({visible: false});
const invsplane = new THREE.Mesh(geometry, material);
scene.add(invsplane);

/* Call animation/rendering loop */

function animate() {
    const elapsedTime = clock.getElapsedTime();

    /* Update Objects */
    invsplane.quaternion.copy(camera.quaternion);

    sphere.rotation.y = SPHERE_PARAMS.rotationSpeed * elapsedTime;
    particleMesh.rotation.y = PARTICLE_PARAMS.particleSpeed * elapsedTime;

    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);

    // check for intersection
    updateParticles();
}

let particles = generateSpiralGalaxy(PARTICLE_PARAMS);
// let particles = generateEllipticalGalaxy(PARTICLE_PARAMS);
// let particles = generateIrregularGalaxy(PARTICLE_PARAMS);

let particleMesh = new THREE.Points(particles[0], particles[1]);
scene.add(particleMesh);
function updateGalaxy() {
    if (PARTICLE_PARAMS.galaxy == 0) {
        particleMesh.removeFromParent();
        particles = generateSpiralGalaxy(PARTICLE_PARAMS);
        particleMesh = new THREE.Points(particles[0], particles[1]);
        scene.add(particleMesh);
    } else if (PARTICLE_PARAMS.galaxy == 1) {
        particleMesh.removeFromParent();
        particles = generateEllipticalGalaxy(PARTICLE_PARAMS);
        particleMesh = new THREE.Points(particles[0], particles[1]);
        scene.add(particleMesh);
    } else if (PARTICLE_PARAMS.galaxy == 2) {
        particleMesh.removeFromParent();
        particles = generateIrregularGalaxy(PARTICLE_PARAMS);
        particleMesh = new THREE.Points(particles[0], particles[1]);
        scene.add(particleMesh);
    }
}

// This function was generated with the help of chatgpt to do the calculations of moving the particles 
// with modifications to make it work for our purpose 
function updateParticles() {
    const posArray = particles[0].attributes.position.array; // Access the internal positionArray 

    // Convert mouse to world coordinates
    var scaleEffect = 0.4
    var threshold = 5;
    
    if (mouse3D.x === 0) {
        return;
    }

    for (let i = 0; i < posArray.length; i += 3) {
        const dx = posArray[i] - mouse3D.x;
        const dy = posArray[i + 1] - mouse3D.y;
        const dz = posArray[i + 2] - mouse3D.z;

        const distanceSquared = dx * dx + dy * dy + dz * dz;

        if (distanceSquared < threshold * threshold ) {
            const distance = Math.sqrt(distanceSquared);
            const scale = (threshold - distance) / threshold; 
            posArray[i] += dx * scale * scale * Math.random(); // Update the positions in the positionArray itself
            posArray[i + 1] += dy * scale * scaleEffect * Math.random();
            posArray[i + 2] += dz * scale * scaleEffect * Math.random();
        }
    }
    particles[0].attributes.position.needsUpdate = true; 
}

animate();

/* TweakPane Implementation */
const pane = new Tweakpane.Pane();

/* Sphere Folder */
const sphereFolder = pane.addFolder({
    title: 'Sphere',
    expanded: false,
});

/* Update sphere rotation speed upon user change */
sphereFolder.addInput(SPHERE_PARAMS, 'rotationSpeed', {min: -3, max: 3, step: 0.1}).on('change', (event) => {
    SPHERE_PARAMS.rotationSpeed = event.value;
});

/* Update sphere color upon user change */
sphereFolder.addInput(SPHERE_PARAMS, 'color').on('change', (event) => {
    sphereMaterial.color = new THREE.Color(event.value);
    sphereMaterial.needsUpdate = true;
});

/* Update sphere particle size upon user request */
sphereFolder.addInput(SPHERE_PARAMS, 'sphereSize', {min: 0.001, max: 0.05, step: 0.001}).on('change', (event) => {
    SPHERE_PARAMS.sphereSize = event.value;
    sphereMaterial.size = event.value;
    sphereMaterial.needsUpdate = true;
});

/* Particle Folder */
const particleFolder = pane.addFolder({
    title: 'Particles',
    expanded: false,
});

/* Update particle speed upon user change */
particleFolder.addInput(PARTICLE_PARAMS, 'particleSpeed', {min: -3, max: 3, step: 0.1}).on('change', (event) => {
    PARTICLE_PARAMS.particleSpeed = event.value;
});

/* Update particle color upon user change */
particleFolder.addInput(PARTICLE_PARAMS, 'color').on('change', (event) => {
    PARTICLE_PARAMS.color = event.value;
    particles[1].color = new THREE.Color(event.value);
    particles[1].needsUpdate = true;
});

/* Update non-sphere particle size upon user request */
particleFolder.addInput(PARTICLE_PARAMS, 'particleSize', {min: 0.001, max: 0.05, step: 0.001}).on('change', (event) => {
   PARTICLE_PARAMS.particleSize = event.value;
   particles[1].size = event.value;
   particles[1].needsUpdate = true;
});

particleFolder.addInput(PARTICLE_PARAMS, 'count', {min: 1000, max: 1000000, step: 1000}).on('change', (event) => {
    PARTICLE_PARAMS.count = event.value;
    updateGalaxy();
 });

particleFolder.addInput(PARTICLE_PARAMS, 'galaxy', {
    options: {
        Spiral: 0,
        Elliptical: 1,
        Irregular: 2,
    }
}).on('change', (event) => {
    PARTICLE_PARAMS.galaxy = event.value;
    updateGalaxy();
});