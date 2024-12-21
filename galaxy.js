import * as THREE from 'three';

// generateSpiralGalaxy is a tutorial based function that follows the guide of 
// https://github.com/PineappleBeer/threejs-journey/tree/master/18-galaxy-generator
// This function should be used to learn from and implement features similar to but in our own
// functions we create and simulations
export const generateSpiralGalaxy = (particleInfo, centerX=0, centerZ=0) => {
    const insideColor = new THREE.Color('#ff6030'); // Set the inside color when its closest to the center 
    const outsideColor = new THREE.Color('#1b3984'); // Set the outside color when its furthest from the center

    // NOTE -> The calculation of the branches of the galaxy and a lot of the math is borrowed from 
    // https://github.com/PineappleBeer/threejs-journey/tree/master/18-galaxy-generator
    const geometry = new THREE.BufferGeometry(); // Create the buffer geometry for the position
    const material = new THREE.PointsMaterial({ // Set the material and all its flags
        size: particleInfo.particleSize,
        color: particleInfo.color,
        depthWrite: false,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
    });
    const count = particleInfo.count; // Count of how many particles are used 
    const posArray = new Float32Array(count * 3); // The position array holding the positions of the particles 
    const colorArray = new Float32Array(count * 3);
    const branches = particleInfo.branches; // The number of branches that spin off from the middle 
    const spin = 3; // The spin factor, more spin = more spirals in the galaxy 
    const randomFactor = 0.1; // The random factor, how dispersed the particles are (randomly)
    const randomPower = 5; // The power used to bring down the particles to the line

    for (let i = 0; i < count; i++) {
        let i3 = i * 3;
        const radius = Math.random() * particleInfo.radius; // the radius (how big) we want the galaxy
        const spinMove = radius * spin; 
        const branchAngle = ( i % branches) / branches * Math.PI * 2; // the angle for the different branches 

        const mixedColor = insideColor.clone(); // For the mixed color effect
        mixedColor.lerp(outsideColor, radius / particleInfo.radius); // Implements mixing the colors

        const randomX = Math.pow(Math.random(), randomPower) * (Math.random() < 0.5 ? 1 : -1) * randomFactor * radius // Calculates a random x position 
        const randomY = Math.pow(Math.random(), randomPower) * (Math.random() < 0.5 ? 1 : -1) * randomFactor * radius // Calculates a random y position 
        const randomZ = Math.pow(Math.random(), randomPower) * (Math.random() < 0.5 ? 1 : -1) * randomFactor * radius // Calculates a random z position 

        posArray[i3] = centerX + Math.sin(branchAngle + spinMove) * radius + randomX; // Creates the vertex position x 
        posArray[i3 + 1] = randomY; // creates the vertex position y 
        posArray[i3 + 2] = centerZ + Math.cos(branchAngle + spinMove) * radius + randomZ; // Creates the vertex position z

        colorArray[i3] = mixedColor.r; // Set the first color (r)
        colorArray[i3 + 1] = mixedColor.g; // Set the second color (g)
        colorArray[i3 + 2] = mixedColor.b; // Set the last color (b)
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3)); // Set the attributes (color and position)
    geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    return [geometry, material] // Return the geometry and material
}

export const generateEllipticalGalaxy = (particleInfo, centerX=0, centerZ=0) => {
    particleInfo.ellipticalOrbits = []; // Clear the elliptical orbits

    /* Create galaxy geometry and material */
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({
        size: particleInfo.particleSize,
        color: particleInfo.color,
        depthWrite: false,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
    });

    const count = particleInfo.count; // Number of particles
    const positionsArray = new Float32Array(count * 3); // Stores the x, y, z coordinates for each particle
    const colorArray = new Float32Array(count * 3); // Stores the colors for each particle
    const insideColor = new THREE.Color('#ff6030'); // Set the inside color when its closest to the center
    const outsideColor = new THREE.Color('#1b3984'); // Set the outside color when it's furthest from the center

    /* ChatGPT was used to help determine the particle distribution.  */
    /* Elliptical Params */
    const a = particleInfo.semiMajor; // Semi-major axis
    const b = particleInfo.semiMinor; // Semi-minor axis
    const c = 1; // Vertical stretch factor

    /* Calculation for elliptical galaxy star positions */
    for (let i = 0; i < count; i++) {

        const r = Math.pow(Math.random(), 5); // Falloff for stars
        const theta = Math.random() * 2 * Math.PI; // Random angle in xz-plane
        const phi = Math.acos((Math.random() * 2) - 1); // Random angle for vertical distribution

        /* Converts spherical coordinates to Cartesian for elliptical scaling */
        const x = a * r * Math.sin(phi) * Math.cos(theta);
        const y = c * r * Math.cos(phi);
        const z = b * r * Math.sin(phi) * Math.sin(theta);

        /* Store the elliptical orbits (these are used to update the particle positions in script.js) */
        particleInfo.ellipticalOrbits.push({
            /* Note: ChatGPT helped me debug here; my calculations for a and b were originally incorrect */
            a: Math.abs(x / Math.cos(theta)),
            b: Math.abs(z / Math.sin(theta)),
            theta: theta,
        });

        /* Mixed color effect */
        const mixedColor = insideColor.clone();
        mixedColor.lerp(outsideColor, r);

        /* Specify x, y, and z coordinates for each particle */
        positionsArray[i * 3] = x;
        positionsArray[i * 3 + 1] = y;
        positionsArray[i * 3 + 2] = z;

        /* Specify the colors for each particle */
        colorArray[i * 3] = mixedColor.r;
        colorArray[i * 3 + 1] = mixedColor.g;
        colorArray[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    return [geometry, material];
}

export const generateHeartbeatGalaxy = (particleInfo) => {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({
        size: particleInfo.particleSize,
        color: particleInfo.color,
    })
    const posArray = new Float32Array(particleInfo.count * 3);
    for (let i = 0; i < posArray.length; i++) {
        posArray[i] = Math.random() - 0.5;
        posArray[i + 1] = Math.random() - 0.5;
        posArray[i + 2] = Math.random() - 0.5;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    return [geometry, material];
}

export const generateQuasarDisk = (particleInfo, centerX=0, centerZ=0) => {
    particleInfo.ellipticalOrbits = []; // Clear the elliptical orbits

    /* Create quasar geometry and material */
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({
        size: particleInfo.particleSize,
        color: particleInfo.color,
        depthWrite: false,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
    });

    const count = particleInfo.count; // Number of particles
    const positionsArray = new Float32Array(count * 3); // Stores the x, y, z coordinates for each particle
    const colorArray = new Float32Array(count * 3); // Stores the colors for each particle
    const insideColor = new THREE.Color('#ff6030'); // Set the inside color when its closest to the center
    const outsideColor = new THREE.Color('#1b3984'); // Set the outside color when it's furthest from the center

    /* Disk Params */
    const radius = 2.5; // Radius of the disk

    /* Calculation for particle positions (much of this is similar to the elliptical galaxy) */
    for (let i = 0; i < count; i++) {

        const r = Math.pow(Math.random(), 1); // Falloff for stars
        const theta = Math.random() * 2 * Math.PI; // Random angle in xz-plane
        const phi = Math.acos((Math.random() * 2) - 1); // Random angle for vertical distribution

        /* Converts spherical coordinates to Cartesian for elliptical scaling */
        const x = radius * r * Math.sin(phi) * Math.cos(theta);
        const y = 0.15 * r * Math.cos(phi); // The 0.5 here makes the disk more flat
        const z = radius * r * Math.sin(phi) * Math.sin(theta);

        /* Store the orbits (these are used to update the particle positions in script.js) */
        particleInfo.ellipticalOrbits.push({
            a: Math.abs(x / Math.cos(theta)),
            b: Math.abs(z / Math.sin(theta)),
            theta: theta,
        });

        /* Mixed color effect */
        const mixedColor = insideColor.clone();
        mixedColor.lerp(outsideColor, r);

        /* Specify x, y, and z coordinates for each particle */
        positionsArray[i * 3] = x;
        positionsArray[i * 3 + 1] = y;
        positionsArray[i * 3 + 2] = z;

        /* Specify the colors for each particle */
        colorArray[i * 3] = mixedColor.r;
        colorArray[i * 3 + 1] = mixedColor.g;
        colorArray[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    return [geometry, material];
}

export const generateQuasarBlackHole = (particleInfo) => {

    /* Create black hole geometry and material */
    const geometry = new THREE.SphereGeometry(0.2, 100, 100);
    const material = new THREE.MeshBasicMaterial({color: 0x000000});

    return [geometry, material];
}

export const generateQuasarBeams = (particleInfo) => {

    /* Create beam geometry and material */
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({
        size: particleInfo.particleSize,
        color: particleInfo.color,
        vertexColors: true,
    });

    const count = 10000; // The number of particles in the beam
    const positionsArray = new Float32Array(count * 3); // Stores the x, y, z coordinates for each particle
    const colorArray = new Float32Array(count * 3); // Stores the colors for each particle
    const insideColor = new THREE.Color('#ffffff');
    const outsideColor = new THREE.Color('#ff8e7c');

    /* Calculation for particle positions */
    for (let i = 0; i < count; i++) {

        /* Generate a random radius, height, and angle to create a point in the cylinder */
        const radius = Math.random() * 0.05;
        const theta = Math.random() * 2 * Math.PI;
        let height = particleInfo.beamHeight * Math.random();

        /* Calculate the x, y, and z coordinates of each particle */
        let x = radius * Math.cos(theta);
        let y = height;
        let z = radius * Math.sin(theta);

        /* Generates a direction for each particle (i.e. if it is shooting up or down) */
        if (Math.random() >= 0.5) {
            y *= -1;
        }

        /* Mixed color effect */
        const mixedColor = insideColor.clone();
        mixedColor.lerp(outsideColor, height / 2.5);

        /* Update positionsArray and colorArray */
        positionsArray[i * 3] = x;
        positionsArray[i * 3 + 1] = y;
        positionsArray[i * 3 + 2] = z;

        colorArray[i * 3] = mixedColor.r;
        colorArray[i * 3 + 1] = mixedColor.g;
        colorArray[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    return [geometry, material];
}