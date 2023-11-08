import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';


/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster;

// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirection = new THREE.Vector3(10, 0, 0);

// rayDirection.normalize();
// raycaster.set(rayOrigin, rayDirection);

// object1.updateMatrixWorld();
// object2.updateMatrixWorld();
// object3.updateMatrixWorld();

// const intersects = raycaster.intersectObjects([object1, object2, object3]);
// console.log(intersects);


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
 * Mouse
 */
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1;
    mouse.y = - (event.clientY / sizes.height * 2 - 1);
}); 

window.addEventListener('click', (event) => {
    if(currentIntersect) {
       if(currentIntersect.object = object1) {
        console.log('Clicked object1');
       }
       if(currentIntersect.object = object2) {
        console.log('Clicked object2');
       }
       if(currentIntersect.object = object3) {
        console.log('Clicked object3');
       }
    }

    if(isDraggingModel || modelIntersect) {
        if(isDraggingModel) {
            isDraggingModel = false
        } else {
            isDraggingModel = true;
        }
    }
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
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
 * Model
 */
const gltfLoader = new GLTFLoader();
let gltfModel = null;

gltfLoader.load(
    '/models/Duck/glTF-Binary/Duck.glb',
    (gltf) => {
        gltfModel = gltf.scene;
        scene.add(gltfModel);
    }
);

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('#ffffff', 0.5);
directionalLight.position.set(1, 2, 3);
scene.add(directionalLight);

/**
 * Animate
 */
const clock = new THREE.Clock();

let currentIntersect = null;

let modelIntersect = null;
let isDraggingModel = false;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // Animate objects
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

    // Cast Ray

    // Cast Ray
    const rayDirection = new THREE.Vector3(0, 0, 10);
    rayDirection.normalize();

    // Cast Ray
    raycaster.setFromCamera(mouse, camera);

    const objectsToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToTest);

    
    // Custom mouse enter/leave
    if(intersects.length) {
        if(currentIntersect === null) {
            console.log('Mouse Enter');
        }
        currentIntersect = intersects[0];
    } else {
        if(currentIntersect !== null) {
            console.log('Mouse Leave');
            currentIntersect = null;
        }
    }
    
    objectsToTest.forEach((obj) => {
        if(currentIntersect?.object === obj) {
            obj.material.color.set('#00ccff');
        } else {
            obj.material.color.set('#ff0000'); 
        }
    });

    // Raycast for Model
    if(gltfModel) {
        modelIntersect = raycaster.intersectObject(gltfModel)?.[0];
        console.log(modelIntersect);
    }

    // Update model on drag
    if(isDraggingModel) {
        gltfModel.position.x = mouse.x * 3;
        gltfModel.position.y = mouse.y * 3;
        console.log(gltfModel.position);
    }

    // Update controls
    controls.update()
    
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()