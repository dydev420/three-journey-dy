console.log('Starting Scene.');

// Get canvas DOM element for renderer
const canvasDom = document.querySelector('.webgl');

// Create Scene
const scene = new THREE.Scene();

// Create Box Geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Create Box Material
const material = new THREE.MeshBasicMaterial({ color: '#008080' });

// Create mesh for Box
const mesh = new THREE.Mesh(geometry, material);

// Add Box mesh to the scene
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);


// Create Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvasDom
});

renderer.setSize(sizes.width, sizes.height);

// First Render
renderer.render(scene, camera);

