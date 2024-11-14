import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

/* Global variables */
let renderer, controls, scene, camera;
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
    color: '#ff0055',
    particleSize: 0.005,
}

/* Three.js code */
scene = new THREE.Scene();

/* Camera setup */
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(0, 0, 5);

/* Create renderer and set up the canvas */
renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* Objects */
const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);

const particlesGeometry = new THREE.BufferGeometry;
const particlesCount = 10000;

const positionArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    positionArray[i] = (Math.random() - 0.5) * 10;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));

/* Materials */
const sphereMaterial = new THREE.PointsMaterial({
    size: SPHERE_PARAMS.sphereSize,
    color: SPHERE_PARAMS.color,
});

const particlesMaterial = new THREE.PointsMaterial({
    size: PARTICLE_PARAMS.particleSize,
    color: PARTICLE_PARAMS.color,
});

/* Meshes */
const sphere = new THREE.Points(sphereGeometry, sphereMaterial);

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(sphere, particlesMesh);

/* Interaction */
controls = new OrbitControls( camera, renderer.domElement );

/* Handle window resize */
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

/* Call animation/rendering loop */
animate();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    /* Update Objects */
    sphere.rotation.y = SPHERE_PARAMS.rotationSpeed * elapsedTime;
    particlesMesh.rotation.y = PARTICLE_PARAMS.particleSpeed * elapsedTime;

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
    particlesMaterial.color = new THREE.Color(event.value);
    particlesMaterial.needsUpdate = true;
});

/* Update non-sphere particle size upon user request */
particleFolder.addInput(PARTICLE_PARAMS, 'particleSize', {min: 0.001, max: 0.05, step: 0.001}).on('change', (event) => {
   PARTICLE_PARAMS.particleSize = event.value;
   particlesMaterial.size = event.value;
   particlesMaterial.needsUpdate = true;
});