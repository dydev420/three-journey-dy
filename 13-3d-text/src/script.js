import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

THREE.ColorManagement.enabled = false

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/d1.png');

/**
 * Fonts
 */
const fontLoader = new FontLoader();
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'DY Threejs Journey',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 6,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4

            }
        );
        textGeometry.center();


        const textMaterial = new THREE.MeshMatcapMaterial();
        textMaterial.matcap = matcapTexture;

        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        scene.add(textMesh);

        for(let i = 0; i < 100; i++) {
            const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
            const donutMesh = new THREE.Mesh(donutGeometry, textMaterial);

            donutMesh.position.x = (Math.random() - 0.5) * 10;
            donutMesh.position.y = (Math.random() - 0.5) * 10;
            donutMesh.position.z =(Math.random() - 0.5) * 10;

            donutMesh.rotation.x = Math.random() * Math.PI;
            donutMesh.rotation.y = Math.random() * Math.PI;

            const scaleFactor = Math.random() * (donutMesh.position.length() / 10);

            donutMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

            scene.add(donutMesh);
        }

    }
)


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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()