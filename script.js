import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

import {
    generateEllipticalGalaxy,
    generateHeartbeatGalaxy, generateQuasarBeams,
    generateQuasarBlackHole,
    generateQuasarDisk,
    generateSpiralGalaxy
} from './galaxy.js';

/* Global variables */
let renderer, controls, scene, camera, deltaTime;
let eKey = false; // Tracks whether the e key is being pressed
let fKey = false; // Tracks whether the f key is being pressed
const clock = new THREE.Clock();

/* Particle Parameters */
const GALAXY_PARAMS = {
    particleSpeed: 1, // The speed of the particles
    color: '#ffffff', // The particle color
    particleSize: 0.005, // The size of each particle
    count: 50000, // Number of particles
    branches: 3, // The number of spiral galaxy branches
    radius: 5, // The galaxy radius
    galaxy: 1, // The galaxy type
    semiMajor: 5, // The semi-major axis for the elliptical galaxy
    semiMinor: 3, // The semi-minor axis for the elliptical galaxy
    ellipticalOrbits: [], // The orbital paths for each particle in the elliptical galaxy
    beamHeight: 1.5, // The beam heights for the quasar
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

/* Skybox Implementation */
const skyboxGeometry = new THREE.SphereGeometry(500, 500, 500);
const skyboxTexture = new THREE.TextureLoader().load('./assets/yale8.jpg');
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

// Implement invisible plane for mouse calculation similar to assignment 3 
const geometry = new THREE.PlaneGeometry(20, 20);
const material = new THREE.MeshBasicMaterial({visible: false});
const invsplane = new THREE.Mesh(geometry, material);
scene.add(invsplane);

/* Create a quaternion and rotate the invisible plane to align with galaxies */
const invsplaneQuaternion = new THREE.Quaternion(Math.sin((-Math.PI / 2) / 2), 0, 0, Math.cos((-Math.PI / 2) / 2));
invsplane.quaternion.copy(invsplaneQuaternion);

/* Call animation/rendering loop */
let elapsedTime = 0;
let phase = 0;
let flip = false;

function animate() {
    deltaTime = clock.getDelta();

    /* This enforces a constant refresh rate across all devices */
    setTimeout(function() {
        requestAnimationFrame(animate);
    }, 1000/60);

    controls.update();
    renderer.render(scene, camera);

    /* Apply any user-specified effects */
    repulsionEffect();
    blackholeEffect();

    /* Update the particle position for the galaxy */
    switch (GALAXY_PARAMS.galaxy) {
        case 0: // If the current galaxy is spiral
            updateSpiralGalaxy();
            break;
        case 1: // If the current galaxy is elliptical
            updateEllipticalGalaxy(deltaTime);
            break;
        case 2: // If the current galaxy is heartbeat
            const delta = clock.getDelta();
            elapsedTime += delta;
            if (elapsedTime >= .1) {
                flip = !flip;
                elapsedTime = 0;
            } 
            if (flip) {
                console.log("flipped on");
                phase = 1;
            } else {
                console.log("flipped off");
                phase = 0;
            }
            updateHeartbeatGalaxy(phase);
            break;
        case 3: // If the current galaxy is a quasar
            GALAXY_PARAMS.particleSpeed = 50.0;
            updateSpiralGalaxy(deltaTime);
            updateQuasarBeams();
            break;
    }
}

let particles = generateEllipticalGalaxy(GALAXY_PARAMS);
let blackHole, blackHoleMesh;
let quasarBeams, quasarBeamMesh;

let particleMesh = new THREE.Points(particles[0], particles[1]);
scene.add(particleMesh);

/* This function will generate a different galaxy type specified by the user  */
function changeGalaxy() {
    /* Remove the black hole and beams */

    if (GALAXY_PARAMS.galaxy !== 3) {
        scene.remove(blackHoleMesh);
        scene.remove(quasarBeamMesh);
    }

    if (GALAXY_PARAMS.galaxy !== 2) {
        fKey = false;
        eKey = false;
    }

    if (GALAXY_PARAMS.galaxy === 0) {
        particleMesh.removeFromParent();
        particles = generateSpiralGalaxy(GALAXY_PARAMS);
        particleMesh = new THREE.Points(particles[0], particles[1]);
        scene.add(particleMesh);
    } else if (GALAXY_PARAMS.galaxy === 1) {
        particleMesh.removeFromParent();
        particles = generateEllipticalGalaxy(GALAXY_PARAMS);
        particleMesh = new THREE.Points(particles[0], particles[1]);
        scene.add(particleMesh);
    } else if (GALAXY_PARAMS.galaxy === 2) {
        particleMesh.removeFromParent();
        particles = generateHeartbeatGalaxy(GALAXY_PARAMS);
        particleMesh = new THREE.Points(particles[0], particles[1]);
        scene.add(particleMesh);
    } else if (GALAXY_PARAMS.galaxy === 3) {
        scene.remove(blackHoleMesh);
        scene.remove(quasarBeamMesh);
        particleMesh.removeFromParent();
        particles = generateQuasarDisk(GALAXY_PARAMS);
        particleMesh = new THREE.Points(particles[0], particles[1]);
        scene.add(particleMesh);
        blackHole = generateQuasarBlackHole(GALAXY_PARAMS);
        blackHoleMesh = new THREE.Mesh(blackHole[0], blackHole[1]);
        scene.add(blackHoleMesh);
        quasarBeams = generateQuasarBeams(GALAXY_PARAMS);
        quasarBeamMesh = new THREE.Points(quasarBeams[0], quasarBeams[1]);
        scene.add(quasarBeamMesh);
    }
}

animate();

/* ---------------- Beginning of Particle Rotation Updates Implementation ---------------- */

/* This function updates the particles of the elliptical galaxy to rotate about the y-axis */
function updateSpiralGalaxy() {
    /* We use the positions array to update particle position, so we need to apply rotation matrix directly.
    *
    *      [ cos(theta), 0, sin(theta),
    * Ry =       0,      1,     0
    *       -sin(theta), 0, cos(theta) ]
    *
    * I couldn't find this rotation matrix from the lecture slides; I found the y-rotation matrix from this article:
    * https://en.wikipedia.org/wiki/Rotation_matrix */

    const posArray = particles[0].attributes.position.array; // Access the internal positionArray
    const radius = GALAXY_PARAMS.radius; // The radius of the galaxy

    for (let i = 0; i < posArray.length; i += 3) {
        let x = posArray[i];
        let z = posArray[i + 2];

        /* Rotate each particle such that particles further from the center rotate slower, creating a lag effect */
        const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(z, 2));
        let angle = ((Math.PI / 900) * (1 - (distance / radius) * .8)) * GALAXY_PARAMS.particleSpeed;

        /* Rotation matrix */
        posArray[i] = x * Math.cos(angle) - z * Math.sin(angle); // Update x position
        posArray[i + 2] = x * Math.sin(angle) + z * Math.cos(angle); // Update z position
    }
    particles[0].attributes.position.needsUpdate = true;
}

/* This function updates the particles of the elliptical galaxy to travel about the y-axis in an elliptical fashion */
function updateEllipticalGalaxy(deltaTime) {
    /* Again, we use the positions array to update particle position, so we need to apply the position updates directly.
     * For an ellipse, it can be described by the following parametric equations:
     *
     * x = a * cos(theta)
     * z = b * sin(theta)
     *
     * Where "a" is the radius of the ellipse in the x direction and "b" is the radius in the z direction.
     * I found these formulas for elliptical motion here: https://www.mathopenref.com/coordparamellipse.html */

    const orbitSpeed = (Math.PI / 20) * GALAXY_PARAMS.particleSpeed; // The user-defined orbital speed
    const posArray = particles[0].attributes.position.array; // Access the internal positionArray
    const orbitParams = GALAXY_PARAMS.ellipticalOrbits; // Orbit params for each particle

    for (let i = 0; i < orbitParams.length; i++) {
        const localOrbitSpeed = (1 - (orbitParams[i].a / 10) * .8) * orbitSpeed;

        /* Calculate the updated x and z positions and update the angle */
        orbitParams[i].theta += localOrbitSpeed * deltaTime;
        let x = GALAXY_PARAMS.ellipticalOrbits[i].a * Math.cos(orbitParams[i].theta);
        let z = GALAXY_PARAMS.ellipticalOrbits[i].b * Math.sin(orbitParams[i].theta);

        /* Update the positions array to the new values */
        posArray[i * 3] = x;
        posArray[i * 3 + 2] = z;
    }
    particles[0].attributes.position.needsUpdate = true;
}

function updateHeartbeatGalaxy(phase) {
    mouse3D.x = 0.1;
    mouse3D.y = 0.1;
    mouse3D.z = 0.1;
    if (phase == 0) {
        eKey = true;
        fKey = false;
        repulsionEffect();
    } else {
        eKey = false;
        fKey = true;
        blackholeEffect();
    }
}

/* This function updates the beams leaving the quasar */
function updateQuasarBeams() {
    const posArray = quasarBeams[0].attributes.position.array; // Access the internal positionArray

    /* Update particle positions */
    for (let i = 0; i < posArray.length; i += 3) {
        /* Decrement the particle height if it's negative and check reset its position to 0 if at minimum height */
        if (posArray[i + 1] <= 0) {
            posArray[i + 1] -= Math.random() * 0.004 * (GALAXY_PARAMS.beamHeight + posArray[i + 1]) + 0.001;
            if (posArray[i + 1] <= -GALAXY_PARAMS.beamHeight) {
                posArray[i + 1] = 0 - (Math.random() * 0.004);
            }
        }
        /* Increment the particle height if it's positive and check reset its position to 0.001 if at max height */
        else if (posArray[i + 1] > 0) {
            posArray[i + 1] += Math.random() * 0.004 * (GALAXY_PARAMS.beamHeight - posArray[i + 1]) + 0.001;
            if (posArray[i + 1] >= GALAXY_PARAMS.beamHeight) {
                posArray[i + 1] = Math.random() * 0.004;
            }
        }
    }
    quasarBeams[0].attributes.position.needsUpdate = true;
}


/* ---------------- End of Particle Rotation Updates Implementation---------------- */

/* ---------------- Beginning of Particle Effects Implementation ---------------- */

// This function was generated with the help of chatgpt to do the calculations of moving the particles 
// with modifications to make it work for our purpose 
function repulsionEffect() {
    if (eKey && !fKey) { // Do the repulsionEffect if only the 'e' key is being held
        const posArray = particles[0].attributes.position.array; // Access the internal positionArray

        /* Effect parameters */
        var scaleEffect = 0.1 // This specifies how fast the particles will be effected
        var threshold = 2; // This specifies the distance for particles to be targeted by the effect

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
                posArray[i] += dx * scale * scaleEffect * Math.random(); // Update the positions in the positionArray itself
                posArray[i + 1] += dy * scale * scaleEffect * Math.random();
                posArray[i + 2] += dz * scale * scaleEffect * Math.random();
            }
        }
        particles[0].attributes.position.needsUpdate = true;
    }
}

/* This function is a modification of the repulsionEffect, which will vacuum particles towards the cursor */
function blackholeEffect() {
    if (fKey && !eKey) { // Do the blackholeEffect if only the 'f' key is being held
        const posArray = particles[0].attributes.position.array; // Access the internal positionArray
        /* Effect parameters */
        var scaleEffect = 0.1 // This specifies how fast the particles will be effected
        var threshold = 2; // This specifies the distance for particles to be targeted by the effect

        if (mouse3D.x === 0) {
            return;
        }

        for (let i = 0; i < posArray.length; i += 3) {
            /* Key difference: the displacement direction here is reversed compared to repulsionEffect */
            const dx = mouse3D.x - posArray[i];
            const dy = mouse3D.y - posArray[i + 1];
            const dz = mouse3D.z - posArray[i + 2];

            const distanceSquared= dx * dx + dy * dy + dz * dz;

            if (distanceSquared < threshold * threshold ) {
                const distance = Math.sqrt(distanceSquared);
                const scale = (threshold - distance) / threshold;
                posArray[i] += dx * scale * scaleEffect * Math.random(); // Update the positions in the positionArray itself
                posArray[i + 1] += dy * scale * scaleEffect * Math.random();
                posArray[i + 2] += dz * scale * scaleEffect * Math.random();
            }
        }
        particles[0].attributes.position.needsUpdate = true;
    }
}

/* ---------------- End of Particle Effects Implementation ---------------- */

/* ---------------- TweakPane Implementation ---------------- */

const pane = new Tweakpane.Pane();

/* Galaxy Folder */
const galaxyFolder = pane.addFolder({
    title: 'General Galaxy Settings',
    expanded: false,
});

/* Change the Galaxy to the one the user requests */
galaxyFolder.addInput(GALAXY_PARAMS, 'galaxy', {
    options: {
        "Spiral (Tutorial)": 0,
        Elliptical: 1,
        Heartbeat: 2,
        "Quasar(Speed Locked)": 3,
    }
}).on('change', (event) => {
    GALAXY_PARAMS.galaxy = event.value;
    changeGalaxy();
});

/* The number of particles */
galaxyFolder.addInput(GALAXY_PARAMS, 'count', {min: 1000, max: 1000000, step: 1000}).on('change', (event) => {
    GALAXY_PARAMS.count = event.value;
    changeGalaxy();
});

/* The speed of the galaxy's rotation */
galaxyFolder.addInput(GALAXY_PARAMS, 'particleSpeed', {min: -5, max: 5, step: 0.1}).on('change', (event) => {
    GALAXY_PARAMS.particleSpeed = event.value;
});

/* Update particle color upon user change */
galaxyFolder.addInput(GALAXY_PARAMS, 'color').on('change', (event) => {
    GALAXY_PARAMS.color = event.value;
    particles[1].color = new THREE.Color(event.value);
    particles[1].needsUpdate = true;
});

/* Update particle size upon user request */
galaxyFolder.addInput(GALAXY_PARAMS, 'particleSize', {min: 0.001, max: 0.05, step: 0.001}).on('change', (event) => {
    GALAXY_PARAMS.particleSize = event.value;
    particles[1].size = event.value;
    quasarBeams[1].size = event.value;
    particles[1].needsUpdate = true;
    quasarBeams[1].needsUpdate = true;
});

/* Spiral Galaxy Folder */
const spiralFolder = pane.addFolder({
   title: 'Spiral Galaxy Specifics',
   expanded: false,
});

/* The number of spirals */
spiralFolder.addInput(GALAXY_PARAMS, 'branches', {min: 2, max: 10, step: 1}).on('change', (event) => {
    GALAXY_PARAMS.branches = event.value;
    changeGalaxy();
});

/* The spiral galaxy radius */
spiralFolder.addInput(GALAXY_PARAMS, 'radius', {min: 2, max: 10, step: 1}).on('change', (event) => {
    GALAXY_PARAMS.radius = event.value;
    changeGalaxy();
});

/* Elliptical Galaxy Folder */
const ellipticalFolder = pane.addFolder({
    title: 'Elliptical Galaxy Specifics',
    expanded: false,
});

/* Adjust the semi-major axis for the elliptical galaxy */
ellipticalFolder.addInput(GALAXY_PARAMS, 'semiMajor', {min: 2, max: 10, step: 1}).on('change', (event) => {
    GALAXY_PARAMS.semiMajor = event.value;
    changeGalaxy();
});

/* Adjust the semi-minor axis for the elliptical galaxy */
ellipticalFolder.addInput(GALAXY_PARAMS, 'semiMinor', {min: 2, max: 10, step: 1}).on('change', (event) => {
    GALAXY_PARAMS.semiMinor = event.value;
    changeGalaxy();
});

/* Quasar Folder */
const quasarFolder = pane.addFolder({
    title: 'Quasar Specifics',
    expanded: false,
});

quasarFolder.addInput(GALAXY_PARAMS, 'beamHeight', {min: 0.5, max: 3, step: 0.1}).on('change', (event) => {
    GALAXY_PARAMS.beamHeight = event.value;
    changeGalaxy();
});

/* ---------------- End of TweakPane Implementation ---------------- */

/* ---------------- Beginning of Event Listeners Implementation ---------------- */

/* This event listener monitors when the 'e' and 'f' keys are pressed. */
window.addEventListener('keydown', function(event)  {
    if (event.key.toLowerCase() === 'e' && !eKey) {
        eKey = true;
        console.log("The 'e' key is being pressed.")
    }
    if (event.key.toLowerCase() === 'f' && !fKey) {
        fKey = true;
        console.log("The 'f' key is being pressed.")
    }
});

/* This event listener monitors when the 'e' and 'f' keys are released. */
window.addEventListener('keyup', function(event) {
    if (event.key.toLowerCase() === 'e') {
        eKey = false;
        console.log("The 'e' key was released.")
    }
    if (event.key.toLowerCase() === 'f') {
        fKey = false;
        console.log("The 'f' key was released.")
    }
});

/* This event listener tracks the mouse movement of the user */
window.addEventListener('mousemove', function(event) {
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
});

/* This event listener handles any potential resizes the user may make.*/
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ---------------- End of Event Listeners Implementation ---------------- */