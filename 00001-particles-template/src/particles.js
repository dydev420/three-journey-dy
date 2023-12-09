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
  size: 0.1,
  radius: 2.0,
  speed: 2.5,
  isMoving: false,
  particleCount: 200,
  branches: 12,
  intersectRadius: 0.05,
};

debugObject.generate = () => {
  generateParticles();
}

debugObject.animate = () => {
  debugObject.isMoving = true;
  startParticleMove();
}

debugObject.stop = () => {
  debugObject.isMoving = false;
}

gui.add(debugObject, 'radius').min(0.1).max(3).step(0.1).onChange(() => {
  generateParticles();
});
gui.add(debugObject, 'particleCount').min(10).max(100).step(10).onChange(() => {
  generateParticles();
});
gui.add(debugObject, 'branches').min(1.0).max(10).step(1.0).onChange(() => {
  generateParticles();
});
gui.add(debugObject, 'generate',); 
gui.add(debugObject, 'animate',); 
gui.add(debugObject, 'stop'); 

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Objects
 */

let particlesGeometry = null;
let particles = null;

const snowState = {
  needsFlake: false,
  activeFlakeIndex: 0,
  fallTime: 0,
};

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


/**
 * Particle Generation
 */

const getParticleStartPostion = (index) => {
  const {
    branches,
    particleCount,
    radius
  } = debugObject;

  const branchAngle = (index % branches) / branches * Math.PI * 2;

  return {
    x: Math.cos(branchAngle) * radius + (Math.random() - 0.5) * (5.0 / branches),
    y: Math.sin(branchAngle) * radius + (Math.random() - 0.5) * (5.0 / branches),
    z: 0.0
  }
}

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
  } = debugObject;

  const positions = new Float32Array(particleCount * 3);
  const animations = new Float32Array(particleCount);
  
  particlesGeometry = new THREE.BufferGeometry();

  for (let i = 0; i < particleCount; i++) {
    let i3 = i * 3;

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

const startParticleMove = () => {
  const {
    particleCount
  } = debugObject;

  const {
    activeFlakeIndex,
  } = snowState;

  if(activeFlakeIndex >= particleCount) {
    console.log('Last Particles Finished');
    return; 
  }

  const positions = particles.geometry.attributes.position.array;
  let i3 = activeFlakeIndex * 3;

  // Spawn 
  const startPosition = getParticleStartPostion(activeFlakeIndex);
  positions[i3    ] = startPosition.x;
  positions[i3 + 1] = startPosition.y;
  positions[i3 + 2] = 0.0;

  particles.geometry.attributes.position.needsUpdate = true;
}


const updateSnowState = () => {
  // update
  snowState.activeFlakeIndex += 1;
  snowState.needsFlake = false;
  snowState.fallTime = 0;

  // Update Debug
  // debugObject.isMoving = false

  // Start New particle
  startParticleMove();
}

const checkIntersect = (flakePos, testPos) => {
  const {
    intersectRadius
  }  = debugObject;

  const distance =  flakePos.distanceTo(testPos);
  if(distance < intersectRadius) {
    return true;
  }

  return false;
}

// Not cheap collsion
const detectCollision = () => {
  const {
    activeFlakeIndex,
  } = snowState;

  let ai3 = activeFlakeIndex * 3; 
  
  const positions = particles.geometry.attributes.position.array;
  const animations = particles.geometry.attributes.animation.array;

  const flakePosition = new THREE.Vector3();
  const testPosition = new THREE.Vector3();

  flakePosition.x = positions[ai3];
  flakePosition.y = positions[ai3 + 1];
  flakePosition.z = positions[ai3 + 2];

  for (let i = 0; i < activeFlakeIndex; i++) {
      let i3 = i * 3;
      
      testPosition.x = positions[i3];
      testPosition.y = positions[i3 + 1];
      testPosition.z = positions[i3 + 2];

      // update state if collsiion detected
      if(checkIntersect(flakePosition, testPosition)) {
        animations[activeFlakeIndex] = 0.0;
        snowState.needsFlake = true;

        particles.geometry.attributes.animation.needsUpdate = true
        break;
      }
  }
}

const moveSingleParticle = () => {
  const {
    radius,
    branches,
    speed
  } = debugObject;

  const {
    activeFlakeIndex,
    fallTime,
  } = snowState;

  let i3 = activeFlakeIndex * 3;
  
  const positions = particles.geometry.attributes.position.array;
  const animations = particles.geometry.attributes.animation.array;

  const branchAngle = (activeFlakeIndex % branches) / branches * Math.PI * 2;

  // const randomShake = (Math.random() - 0.5) * 0.1;
  let randomShake = (Math.cos(fallTime * 50.0) - 0.5) * 0.2;
  const newRadius = radius - fallTime * speed;
  randomShake = randomShake *  (1 - newRadius/radius) * 3.0;

  const finalAngle = (branchAngle + randomShake) * 1.0;

  console.log('randomShake', randomShake);

  positions[i3] = Math.cos(finalAngle) * (radius - fallTime * speed);
  positions[i3 + 1] = Math.sin(finalAngle) * (radius - fallTime * speed);

  const distanceVector = new THREE.Vector3(positions[i3], positions[i3+ 1], positions[i3+2]);

  // Mark particles as finished AND set update snow flag
  if(distanceVector.length() < 0.01) {
    animations[activeFlakeIndex] = 0.0;
    snowState.needsFlake = true;
  }

  particles.geometry.attributes.position.needsUpdate = true;
  particles.geometry.attributes.animation.needsUpdate = true;
}

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


const tick = () =>
{
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;

  // Update previousTime
  previousTime = elapsedTime;

  // Update material
  // material.uniforms.uTime.value = elapsedTime;


  if(debugObject.isMoving) {
    snowState.fallTime += deltaTime;
    // moveToCenter(elapsedTime);
    moveSingleParticle(elapsedTime);

    detectCollision();
  }

  if(snowState.needsFlake) {
    updateSnowState();
  }

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()