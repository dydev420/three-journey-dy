import * as THREE from 'three'
import GUI from 'lil-gui'
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'

import generateSnowflake, { animateBody } from './patterns/snowflake';
import generateScene, { addBoxMesh, addDebugMesh, addReferenceMesh, addSphereMesh, getMeshVertexPositions } from './scene/mainScene';
import generatePhysWorld, { addBoxBody, addSphereBody } from './physics/physWorld';



const initialSpawnLocation = {
  x: 50,
  y: 2,
  z: 0
}

/**
 * Debug
 */
const gui = new GUI();

const debugObject = {};
debugObject.maxBoxes = 100;
debugObject.startForce = 10;
debugObject.isGenerating = false;

debugObject.createBox = () => {
    createSphere(lastSpawnPosition);
}

debugObject.generateSnowflake = () => {
  createSphere(generateSnowflake(lastSpawnPosition));
}

debugObject.reset = () => {
    objectsToUpdate.forEach((item) => {
        // item.body.removeEventListener('collide', playHitSound);

        world.removeBody(item.body);
        scene.remove(item.mesh);
    });

    objectsToUpdate.splice(0, objectsToUpdate.length);
    lastSpawnPosition.x = initialSpawnLocation.x;
    lastSpawnPosition.y = initialSpawnLocation.y;
    lastSpawnPosition.z = initialSpawnLocation.z;
}

debugObject.start = () => {
    const firstItem = objectsToUpdate[0];

    if(firstItem) {
        firstItem.body.applyLocalForce(
            new CANNON.Vec3(0, 0, debugObject.startForce),
            new CANNON.Vec3(0, 1.5, 0,)
        );
    }
}

debugObject.startGenerating = () => {
  debugObject.isGenerating = true;
}

debugObject.stopGenerating = () => {
  debugObject.isGenerating = false;
}

debugObject.enableSound = false;


gui.add(debugObject, 'createBox');
gui.add(debugObject, 'generateSnowflake');
gui.add(debugObject, 'startGenerating');
gui.add(debugObject, 'stopGenerating');
gui.add(debugObject, 'reset');
gui.add(debugObject, 'start');
gui.add(debugObject, 'startForce');
gui.add(debugObject, 'maxBoxes');


/**
 * Base
*/
// Canvas
const canvas = document.querySelector('canvas.webgl');

/////////

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
 * Worlds
*/
const {
  scene,
  camera,
  controls,
  floor
} = generateScene(canvas, sizes);

const world = generatePhysWorld()

// console.log(scene, camera, controls, floor, world);

/**
 * Cannon Debugger
 */
const cannonHelper = new CannonDebugger(scene, world);

/**
 * Renderer
*/
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// Box Utils
const objectsToUpdate = [];
let activeCreatedBox = null;

// Spawn logic
const lastSpawnPosition = {
  x: initialSpawnLocation.x,
  y: initialSpawnLocation.y,
  z: initialSpawnLocation.z
};


const updateLastSpawnLocation = (position) => {
  lastSpawnPosition.x = position.x;
  lastSpawnPosition.y = position.y;
  lastSpawnPosition.z = position.z;
}

const incrementLastSpawnLocation = (position) => {
  lastSpawnPosition.z += 1;
}

const createBox = (position) => {

  // Sphere mesh item
  const mesh = addBoxMesh(position);

  // Sphere Physics Item
  const body = addBoxBody(position);

  const rigidBody = {
    isMoving: true,
    mesh,
    body,
    onCollision: function () {
      // on Cloosion
      body.velocity.x = 0;
      body.velocity.y = 0;
      body.type = CANNON.Body.KINEMATIC;
      rigidBody.isMoving = false
    }
  };

  rigidBody.body.addEventListener('collide', rigidBody.onCollision);

  // Save in objects to update
  objectsToUpdate.push(rigidBody);
  activeCreatedBox = rigidBody;

  updateLastSpawnLocation(position);
}


const createSphere = (position) => {

  // Sphere mesh item
  const mesh = addSphereMesh(position);

  // Sphere Physics Item
  const body = addSphereBody(position);

  const rigidBody = {
    isMoving: true,
    mesh,
    body,
    onCollision: () => {
     body.velocity.x = 0;
     body.velocity.y = 0;
     body.type = CANNON.Body.KINEMATIC;
     rigidBody.isMoving = false
    }
  };

  rigidBody.body.addEventListener('collide', rigidBody.onCollision);

  // Save in objects to update
  objectsToUpdate.push(rigidBody);
  activeCreatedBox = rigidBody;

  updateLastSpawnLocation(position);
}

/**
 * Reference Mesh Utils
 */

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime;
    
    // Update time tracker
    previousTime = elapsedTime;

    // Update Physics World
    world.step(1 / 60, deltaTime, 3);
    
    // Animate created Box
    if(activeCreatedBox) {
      animateBody(activeCreatedBox);
    }

    // Update Physics bodies
    objectsToUpdate.forEach((obj) => {
        obj.mesh.position.copy(obj.body.position);
        obj.mesh.quaternion.copy(obj.body.quaternion);
    });


    // Generate New Objects
    if(debugObject.isGenerating) {
      const canGenerate = !activeCreatedBox || !activeCreatedBox.isMoving;
      const isWitinLimit = objectsToUpdate.length < debugObject.maxBoxes;

      if(canGenerate && isWitinLimit) {
        createSphere(generateSnowflake(lastSpawnPosition));
      }
    }

    // Update controls
    controls.update();

    // Cannon Helper
    // cannonHelper.update();

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick();