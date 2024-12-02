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
    // NOT DONE
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
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3)); // Set the attributes (color and position )
    geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    return [geometry, material] // Return the geometry and material

}

export const generateEllipticalGalaxy = (particleInfo, centerX=0, centerZ=0) => {
    // These galaxies are "egg shaped"
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({
        size: particleInfo.particleSize,
        color: particleInfo.color,
        size: particleInfo.particleSize,
    });
    const count = particleInfo.count;
    // Bigger radius looks nicer on the ellipticial galaxy 
    // usually they are filled in though i need to figure out how to do that
    const radius = particleInfo.radius * 2;
    const posArray = new Float32Array(count * 3);
    const randomFactor = 0.1;
    for (let i = 0; i < count; i++) {
        const angle = (2 * Math.PI * i ) / count;

        let i3 = i * 3;
        
        const randomX = centerX + (Math.random() - 0.5) * randomFactor * radius;
        const randomY = (Math.random() - 0.5) * randomFactor * radius;
        const randomZ = centerZ + (Math.random() - 0.5) * randomFactor * radius/2;

        posArray[i3] = Math.cos(angle) * radius / 5 + randomX;
        posArray[i3 + 1] = randomY;
        posArray[i3 + 2] = Math.sin(angle) * radius/3 + randomZ ;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    return [geometry, material]
}
export const generateIrregularGalaxy = (particleInfo) => {
    console.log("Added soon");
}