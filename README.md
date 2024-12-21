# Particulum - CS460_Final_Project
## By Chase Quigley and Liam Willis

## Description
Particulum is a 3D particle simulator which primarily aims to model various space objects, such as spiral galaxies, elliptical galaxies, and quasars. The simulator also allows the user to 
adjust various parameters to create their own unique galaxy visualizations. This includes galaxy color, type, particle speed, particle size, number of spirals, elliptical galaxy shape, and 
much more!

## Installation
This simulator doesn't require any complex installation. All that is required is a WebGL compatible browser and a link to the site:
* https://lykos3d.github.io/CS460_Final_Project/

## How to - Guide
Upon loading the page, the default elliptical galaxy and parameters will be set. These parameters are able to be configured in the TweakPane menu at the top right of the screen. There are four
different folders:
* General Galaxy Settings: These settings will mostly apply to all particles, regardless of galaxy time. They include:
  * Galaxy type: This menu allows you to select between the different types of galaxies: Spiral, Elliptical, Heartbeat, and Quasar. 
  * Count: This allows you to adjust the number of particles that will load for the galaxy (warning: expensive)!
  * Particle Speed: This will adjust the speed at which the particles will revolve about the center of the galaxy. 
  * Color: This will allow you to change the color of the particles to any specified RGB value.
  * Particle Size: This allows you to change the size of the particles.
* Spiral Galaxy Specifics: These settings will only apply if the Spiral Galaxy is selected:
  * Branches: This changes the number of spiral branches that will form upon galaxy creation. 
  * Radius: This changes the total radius of the spiral galaxy.
* Elliptical Galaxy Specifics: These settings will only apply if the Elliptical Galaxy is selected:
  * Semi Major Axis: This setting allows the user to change the shape of the galaxy by making it "longer."
  * Semi Major Axis: This setting allows the user to change the shape of the galaxy by making it "wider."
* Quasar: These settings will only apply if the Quasar is selected:
  * Beam Height: This will change the height of the beam shooting vertically from the black hole.

## Visuals 

### Elliptical Galaxy
![elliptical galaxy](./assets/Elliptical.png)

### Spiral Galaxy
![spiral galaxy](./assets/Spiral.png)

### Quasar
![quasar](./assets/Quasar.png)

## Challenges 
* Creating the specific shapes, such as our elliptical galaxy
* Particle distributions
* Render ordering issues
* Implementing the invisible plane in a 3D environment 

## References 
### Github Tutorial
https://github.com/PineappleBeer/threejs-journey/tree/master/18-galaxy-generator
The above link was used in order to create the (tutorial) spiral galaxy 

### ChatGPT 
This was used in order to help with the math equations and formulas needed in order to move particles
or to generate specific outcomes in our project 

### CS460 Lectures
We applied knowledge from the CS460 lecture slides. Examples include
1. "Picking". This is a technique we learned in assignment 3 where we used an invisible plane in order to project from 2D screen space into the 3D scene.
2. "Skybox". This is a technique we learned towards the end of the semester in which we render an image (in our case) to make the user feel like they are within space itself when in reality they are just in the illusion of a 3D enviornment around them. 

### StackOverflow
References to stack overflow for specific threejs implementations practices or best practices overall were referred to occasionally. 

### Nasa 
https://nasa3d.arc.nasa.gov/images
The above link was referenced in finding a background image (a skybox texture). 