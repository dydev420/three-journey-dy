import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
gui.close()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
// const particles
// Load all textures to try them from gui
for(let i= 0; i < 13; i++) {

}
const particleTexture = textureLoader.load('./textures/particles/9.png');

/**
 * Particles
 */
// Custom particle geometry
const particlesGeometry = new THREE.BufferGeometry();
const count = 20000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for(let i = 0; i < count * 3 ; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
}
const particlesPostionAttributes = new THREE.BufferAttribute(positions, 3);
const particlesColorsAttributes = new THREE.BufferAttribute(colors, 3);

particlesGeometry.setAttribute(
    'position',
    particlesPostionAttributes
);

particlesGeometry.setAttribute(
    'color',
    particlesColorsAttributes
);

const particlesMaterial = new THREE.PointsMaterial({
    transparent: true,
    color: '#ff00ff',
    size: 0.1,
    sizeAttenuation: true,
    alphaMap: particleTexture,
    // alphaTest: 0.001,
    // depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);


/**
 * Test cube
 */
const testCube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)
testCube.visible = false;
gui.add(testCube, 'visible');
scene.add(testCube)

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
camera.position.x = 4;
camera.position.y = 3;
camera.position.z = 6;
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
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    for(let i = 0; i< count * 3; i++) {
        const i3 = i * 3;

        const xIndex = i3 + 0;
        const yIndex = i3 + 1;
        const zIndex = i3 + 2;

        const x = particlesGeometry.attributes.position.array[xIndex]
        const z = particlesGeometry.attributes.position.array[zIndex]
        particlesGeometry.attributes.position.array[yIndex] = (Math.sin(elapsedTime + x) + Math.cos(elapsedTime + z)) * 0.5;

    }

    particlesGeometry.attributes.position.needsUpdate = true;

    // particles.rotation.x += 0.001;
    particles.rotation.y += 0.001;
    // particles.rotation.z += 0.001;

    // particles.position.y -= 0.001;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()