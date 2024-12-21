# Particulum - CS460_Final_Project
## By Chase Quigley and Liam Willis

![image] ("https://github.com/Lykos3D/CS460_Final_Project/tree/main/assets/Elliptical.png")

## Description
Particulum is a 3D particle simulator which primarily aims to model various space objects, such as spiral galaxies, elliptical galaxies, and quasars. The simulator also allows the user to 
adjust various parameters to create 

## Usage 
Users can freely move around the simulated galaxy in front of them by moving the mouse on their computer. Users also have the ability to tweak the simulation by our implementation of TweakPane. We offer the ability to change the particle speed, particle size, particle count, and color. We also offer the ability for users to change between the spiral, elliptical, and irregular galaxy implementations. 

## How to - Guide
Users can apply a "blackhole effect" to the current position of the mouse which will vaccum particles towards itself, in a blackhole
styled manner 

## Challenges 
* Creating the specific shapes, such as our elliptical galaxy
* Particle distributions
* Render ordering issues
* Implementing the invisible plane in a 3D environment 

## Next Steps (Taken from the Final Presentation)
* Implement more simulations (irregular galaxies, quasars)
* Fix awkward particle position updates (e.g. elliptical) - [x]
* Fine tune some of our calculations, add more customizations
* Allow custom user gradients for galaxies

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