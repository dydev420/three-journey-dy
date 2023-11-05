
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const dominoParams = {
  width: 0.6,
  height: 1,
  depth: 0.2,
};

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
    color: '#00FFFF',
    metalness: 0.3,
    roughness: 0.4,
});
// const boxMaterial = new THREE.MeshStandardMaterial({
//   color: '#00FFFF'
// });

let scene = null;

const generateScene = (canvas, sizes) => {
  if(!scene) {
    scene = new THREE.Scene();
    console.log('generating new scene', scene);
  }
  /**
   * Floor
   */
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
    })
    // new THREE.MeshBasicMaterial({
    //   color: '#808080'
    // })
  );
  floor.receiveShadow = true;
  floor.rotation.x = - Math.PI * 0.5;
  scene.add(floor);

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
   * Camera
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.set(- 3, 3, 3)
  scene.add(camera)
  
  // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  
  const sceneElements = {
    scene,
    camera,
    controls,
    floor
  }

  return sceneElements;
}

const addBoxMesh = (position) => {
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

  console.log(mesh);

  return mesh;
}

export default generateScene;

export {
  addBoxMesh
};

