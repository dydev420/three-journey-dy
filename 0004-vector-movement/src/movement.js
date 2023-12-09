import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

import snowflakeVertex from './shaders/snowflake/snowflakeVertex.glsl';
import snowflakeFragment from './shaders/snowflake/snowflakeFragment.glsl';

/**
 * Base
 */
// Debug
const gui = new GUI();

const debugObject = {
  generateAtRandom: true,
  size: 0.1,
  radius: 2.0,
  speed: 2.5,
  isMoving: false,
  particleCount: 200,
  branches: 12,
  intersectRadius: 0.05,
  speed: 0.3,
  velocity: {
    x: 0.02,
    y: 0.01
  }
};


debugObject.generate = () => {
  generateParticles();
}

gui.add(debugObject, 'generate');
gui.add(debugObject, 'generateAtRandom');

gui.add(debugObject, 'radius').min(0.1).max(3).step(0.1).onChange(() => {
  generateParticles();
});
gui.add(debugObject, 'particleCount').min(10).max(200).step(10).onChange(() => {
  generateParticles();
});
gui.add(debugObject, 'branches').min(1.0).max(10).step(1.0).onChange(() => {
  generateParticles();
});


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

let particlesGeometry = null;
let particles = null;
let particleVelocity = new THREE.Vector2(
  debugObject.velocity.x,
  debugObject.velocity.y
  );


const generateParticles = () => {
  
  // Cleanup Previous geometry
  if(particles !== null) {
    particles.geometry.dispose();
    particles.material.dispose();
    scene.remove(particles)
  }

  const { 
    particleCount,
    radius,
    branches,
    generateAtRandom
  } = debugObject;

  const positions = new Float32Array(particleCount * 3);
  const animations = new Float32Array(particleCount);
  
  particlesGeometry = new THREE.BufferGeometry();

  for (let i = 0; i < particleCount; i++) {
    let i3 = i * 3;

    if(generateAtRandom) {
      positions[i3] = (Math.random() - 0.5) * 3.0;
      positions[i3 + 1] = (Math.random() - 0.5) * 3.0;
    }

    // Update Animation Status
    animations[i] = 1.0;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('animation', new THREE.BufferAttribute(animations, 1));

  particles = new THREE.Points(
    particlesGeometry,
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      vertexShader: snowflakeVertex,
      fragmentShader: snowflakeFragment,
      uniforms: {
          uTime: { value: 0 },
          uSize: { value: 30.0 * renderer.getPixelRatio() },
      }
  })
  );

  scene.add(particles);
}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () =>
{
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
* Camera
*/
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
* Renderer
*/
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// ---------

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
scene.add(ambientLight);

/**
* Animate
*/
const clock = new THREE.Clock();
let previousTime = 0;

const updateVelocity = (position) => {
  particleVelocity.x = -position.x * 0.005;
  particleVelocity.y = -position.y * 0.005;
}

const shakeVelocity = () => {
  particleVelocity.x += -particleVelocity.x * 0.01 * Math.random();
  particleVelocity.y += -particleVelocity.y * 0.01 * Math.random();
}

const updateParticle = (index = 0) => {
  if(!particles) {
    return;
  }

  const positions = particles.geometry.attributes.position.array;
  
  positions.forEach((pos, i) => {
    let i3 = i * 3;
    
      // Update velocity
      updateVelocity({
        x: positions[i3],
        y: positions[i3 + 1]
      });

      // Randomize velocity
      shakeVelocity();
    
      // Update Position s
      positions[i3    ] += particleVelocity.x;
      positions[i3 + 1] += particleVelocity.y;
  });

  particles.geometry.attributes.position.needsUpdate = true;

};



const tick = () =>
{
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;

  // Update previousTime
  previousTime = elapsedTime;

  // Update material
  // material.uniforms.uTime.value = elapsedTime;
  if(particles?.length) {
    particles.forEach((element, index) => {
    });
  }
  updateParticle();

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()