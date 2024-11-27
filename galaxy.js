import * as THREE from 'three';


export const generateSpiralGalaxy = (particleInfo, centerX=0, centerZ=0) => {

    // NOTE -> The calculation of the branches of the galaxy and a lot of the math is borrowed from 
    // https://github.com/PineappleBeer/threejs-journey/tree/master/18-galaxy-generator
    // NOT DONE
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({
        size: particleInfo.particleSize,
        color: particleInfo.color,
        size: particleInfo.particleSize,
    });
    const count = particleInfo.count; // Count of how many particles are used 
    const posArray = new Float32Array(count * 3); // The position array holding the positions of the particles 
    const branches = particleInfo.branches; // The number of branches that spin off from the middle 
    const spin = 3;
    const randomFactor = 0.1;
    for (let i = 0; i < count; i++) {
        let i3 = i * 3;
        const radius = Math.random() * particleInfo.radius;
        const spinMove = radius * spin;
        const branchAngle = ( i % branches) / branches * Math.PI * 2;

        const randomX = (Math.random() - 0.5) * randomFactor * radius
        const randomY = (Math.random() - 0.5) * randomFactor * radius
        const randomZ = (Math.random() - 0.5) * randomFactor * radius

        posArray[i3] = centerX + Math.sin(branchAngle + spinMove) * radius + randomX;
        posArray[i3 + 1] = randomY;
        posArray[i3 + 2] = centerZ + Math.cos(branchAngle + spinMove) * radius + randomZ;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    return [geometry, material]

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