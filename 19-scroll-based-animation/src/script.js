import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#8080ff'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        material.color.set(parameters.materialColor);
        particlesMaterial.color.set(parameters.materialColor);
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Light
 */

const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

/**
 * Objects
 */
// Texture
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load('textures/gradients/3.jpg');
gradientTexture.magFilter = THREE.NearestFilter;

// Material
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture,
});


const objectsDistance = 4
// Meshes
const mesh1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.5, 1),
   material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

mesh1.position.y = 0;
mesh2.position.y = -objectsDistance;
mesh3.position.y = -objectsDistance * 2;

mesh1.position.x = 2
mesh2.position.x = -2;
mesh3.position.x = 2;

scene.add(mesh1, mesh2, mesh3);

const sectionMeshes = [
    mesh1,
    mesh2,
    mesh3
];

/**
 * Particles
 */

// Geometry
const particleCount = 200;
const positions = new Float32Array(particleCount * 3);

positions.forEach((item, i) => {
    item
})

for (let i = 0; i < particleCount; i++) {
   positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
   positions[i * 3 + 1] = objectsDistance/2 - Math.random() * objectsDistance * sectionMeshes.length;
   positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

}

const particlesGeometry= new THREE.BufferGeometry();

particlesGeometry.setAttribute(
 'position',
 new THREE.BufferAttribute(positions, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.02
});

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);

scene.add(particles);

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

// Base Camera group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base Camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    const newSection = Math.round(scrollY / sizes.height);
    
    if(newSection !== currentSection) {
        currentSection = newSection;

        // Animation trigger
        gsap.to(
            sectionMeshes[currentSection]?.rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=5',
                z: '+=1.5'
            }
        );
    }
});

/**
 * Curson
 */
const cursor = {
    x: 0,
    y:0
};

window.addEventListener('mousemove', (event) => {
    cursor.x = (event.clientX / sizes.width) - 0.5;
    cursor.y = (event.clientY / sizes.height) - 0.5;
})

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;

    // Update previous time
    previousTime = elapsedTime;

    // Animate camera
    camera.position.y = -1 * (scrollY / sizes.height) * 4;

    const parallax = {
        x: cursor.x / 2,
        y: -cursor.y / 2
    };

    cameraGroup.position.x += (parallax.x - cameraGroup.position.x) * deltaTime *  5;
    cameraGroup.position.y += (parallax.y - cameraGroup.position.y) * deltaTime * 5;

    // Animate meshes
    sectionMeshes.forEach((meshItem) => {
        meshItem.rotation.x += deltaTime * 0.1;
        meshItem.rotation.y += deltaTime * 0.08;
    });

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()