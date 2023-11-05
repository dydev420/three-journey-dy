import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import * as CANNON from 'cannon-es'


/**
 * My Configs
 */
const spawnStepDistance = 0.8;
const physicProps = {
    restitution: 0,
    friction: 0.005,
    forceStrength: 10,
}
const dominoParams = {
    width: 0.6,
    height: 1,
    depth: 0.2,
};

const initialSpawnLocation = {
    x: 0,
    y: 0.5,
    z: -10
}


/**
 * Debug
 */
const gui = new GUI();


const debugObject = {};
debugObject.createBox = () => {
    createBox(lastSpawnPosition);
}

debugObject.reset = () => {
    objectsToUpdate.forEach((item) => {
        item.body.removeEventListener('collide', playHitSound);

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
            new CANNON.Vec3(0, 0, physicProps.forceStrength),
            new CANNON.Vec3(0, 1.5, 0,)
        );
    }
}

debugObject.enableSound = false;


gui.add(debugObject, 'createBox');
gui.add(debugObject, 'reset');
gui.add(debugObject, 'start');
// gui.add(debugObject, 'enableSound');

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sounds
 */
const hitSound = new Audio('/sounds/hit.mp3');

const playHitSound = (collision) => {
    if(!debugObject.enableSound) {
        return;
    }
    const impactVelocity = collision.contact.getImpactVelocityAlongNormal();
    console.log(impactVelocity);

    if(impactVelocity > 0.2) {
        hitSound.volume = Math.random();
        hitSound.currentTime = 0
        hitSound.play();
    }
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Physics
 */
// World
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
world.gravity.set(
    0,
    -9.82,
    0
);

// Phys Materials
const defaultMaterial = new CANNON.Material('default');

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: physicProps.friction,
        restitution: physicProps.restitution
    }
);

world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

// Sphere physics
// const sphereShape = new CANNON.Sphere(0.5);
// const sphereBody = new CANNON.Body({
//     mass: 1,
//     position: new CANNON.Vec3(0, 3, 0),
//     shape: sphereShape,
// });
// sphereBody.applyLocalForce(
//     new CANNON.Vec3(150, 0, 0),
//     new CANNON.Vec3(0, 0, 0,)
// );

// world.addBody(sphereBody);

// Floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
// floor.mass = 0; // default is 0
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI * 0.5
);
world.addBody(floorBody);


/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Utils
 */
const objectsToUpdate = [];

// Spawn logic
const lastSpawnPosition = {
    x: initialSpawnLocation.x,
    y: initialSpawnLocation.y,
    z: initialSpawnLocation.z
};

const updateLastSpawnLoacation = () => {
    lastSpawnPosition.z += 1;
}

// Box Utils
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
});

const createBox = (position) => {
    const  {
        width,
        height,
        depth
    } = dominoParams;

    // Sphere mesh item
    const mesh = new THREE.Mesh(
        boxGeometry,
        boxMaterial
    );
    mesh.scale.set(width, height, depth);
    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh);

    // Sphere Physics Item
    const shape = new CANNON.Box(
        new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
    );
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
    });
    body.position.copy(position);
    world.addBody(body);

    // listen to coliide events
    body.addEventListener('collide', playHitSound);

    // Save in objects to update
    objectsToUpdate.push({
        mesh,
        body
    });
    updateLastSpawnLoacation();
}

// Sample Box create
createBox(lastSpawnPosition);

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
    
    // Apply wind force
    // sphereBody.applyForce(
    //     new CANNON.Vec3(-0.5, 0, 0),
    //     sphereBody.position
    // );

    // Update Physics World
    world.step(1 / 60, deltaTime, 3);

    // Update Physics bodies
    objectsToUpdate.forEach((obj) => {
        obj.mesh.position.copy(obj.body.position);
        obj.mesh.quaternion.copy(obj.body.quaternion);
    });


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()