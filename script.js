import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

import { generateEllipticalGalaxy, generateSpiralGalaxy } from './galaxy.js';
import { drawImage } from './image.js';

/* Global variables */
let renderer, controls, scene, camera, mouseX, mouseY;
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
    count: 1000000,
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
renderer.setClearColor(0x9a52a3, .15);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* Objects */
const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);

// const particles = generateSpiralGalaxy(PARTICLE_PARAMS);
const particles = generateEllipticalGalaxy(PARTICLE_PARAMS);

// experimental 
const lines =  await drawImage();
console.log(particles);

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

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const mouse3D = new THREE.Vector3();

const onMouseMove = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('mousemove', onMouseMove, false);

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


    // check for intersection
    updateParticles();
}

// This function was generated with the help of chatgpt to do the calculations of moving the particles 
// with modifications to make it work for our purpose 
function updateParticles() {
    const posArray = particles[0].attributes.position.array;

    // Convert mouse to world coordinates
    raycaster.setFromCamera(mouse, camera);
    const plane = new THREE.Plane( new THREE.Vector3(0, 0, 0), 0);
    raycaster.ray.intersectPlane(plane, mouse3D);
    var scaleEffect = 0.4
    var threshold = 10;
    for (let i = 0; i < posArray.length; i += 3) {
        const dx = posArray[i] - mouse3D.x;
        const dy = posArray[i + 1] - mouse3D.y;
        const dz = posArray[i + 2] - mouse3D.z;

        const distanceSquared = dx * dx + dy * dy + dz * dz;

        if (distanceSquared < threshold ) {
            const distance = Math.sqrt(distanceSquared);
            const scale = (threshold - distance) / threshold; 
            posArray[i] += dx * scale * scale * Math.random();
            posArray[i + 1] += dy * scale * scaleEffect * Math.random();
            posArray[i + 2] += dz * scale * scaleEffect * Math.random();
        }
    }

    particles[0].attributes.position.needsUpdate = true; 
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