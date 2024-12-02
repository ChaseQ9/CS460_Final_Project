import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

import { generateEllipticalGalaxy, generateSpiralGalaxy } from './galaxy.js';
import { drawImage } from './image.js';

/* Global variables */
let renderer, controls, scene, camera, mouseX, mouseY;
const clock = new THREE.Clock();


var lines = await drawImage();
console.log(lines);

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
    count: 100000,
    branches: 3,
    radius: 5,
}

/* Three.js code */
scene = new THREE.Scene();

/* Camera setup */
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(0, 3, 6);

/* Create renderer and set up the canvas */
renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* Objects */
const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);

const particles = generateSpiralGalaxy(PARTICLE_PARAMS);
// const particles = generateEllipticalGalaxy(PARTICLE_PARAMS);

/* Materials */
const sphereMaterial = new THREE.PointsMaterial({
    size: SPHERE_PARAMS.sphereSize,
    color: SPHERE_PARAMS.color,
});

/* Meshes */
const sphere = new THREE.Points(sphereGeometry, sphereMaterial);
const particleMesh = new THREE.Points(particles[0], particles[1]);
scene.add(sphere, particleMesh);


/* Interaction */
controls = new OrbitControls( camera, renderer.domElement );

/* Handle window resize */
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('mousemove', (ev) => {
    mouseX = ev.x;
    mouseY = ev.y;

    var vp_coords = new THREE.Vector2( 
        ( mouseX / window.innerWidth ) * 2 - 1,  
        -( mouseY / window.innerHeight ) * 2 + 1);

    mouseX = vp_coords.x;
    mouseY = vp_coords.y;    
    // normalized mouse coordinates 
})

// ************************
// Could be uncommented but for now keep it commented because it does not work well
//
// window.onkeydown = (ev) => {
//     if (ev.code == 'Space') {
//         console.log(mouseX, mouseY);
//         // not working correctly
//         const parts = generateEllipticalGalaxy(PARTICLE_PARAMS, mouseX, mouseY);
//         const pMesh = new THREE.Points(parts[0], parts[1]);
//         scene.add(pMesh);
        
//     }
// }


/* Call animation/rendering loop */
animate();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    /* Update Objects */
    sphere.rotation.y = SPHERE_PARAMS.rotationSpeed * elapsedTime;
    particleMesh.rotation.y = PARTICLE_PARAMS.particleSpeed * elapsedTime;

    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}

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