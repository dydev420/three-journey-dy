
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const dominoParams = {
  width: 0.6,
  height: 1,
  depth: 0.2,
  radius: 1,
};

const planeScale = 100;

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
    color: '#00FFFF',
    metalness: 0.3,
    roughness: 0.4,
});
// const boxMaterial = new THREE.MeshStandardMaterial({
//   color: '#00FFFF'
// });

const sphereGeometry = new THREE.SphereGeometry(dominoParams.radius, 16, 16);
const sphereMaterial = new THREE.MeshStandardMaterial({
    // wireframe: true,
    color: '#CC00CC',
    metalness: 0.3,
    roughness: 0.4,
});

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
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
    })
  );
  floor.scale.set(planeScale, planeScale, planeScale);
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
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000)
  // camera.position.set(- 3, 3, 3)
  camera.position.set(5, 50, 5)
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

  return mesh;
}

const addSphereMesh = (position) => {

  // Sphere mesh item
  const mesh = new THREE.Mesh(
      sphereGeometry,
      sphereMaterial
  );
  // mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  return mesh;
}

const addDebugMesh = (position) => {
  const debugMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1),
    new THREE.MeshStandardMaterial({
      color: {
        r: 1- position.x,
        g: 1- position.y,
        b: 1- position.z,
      }
    })
  );

  debugMesh.position.copy(position);

  scene.add(debugMesh);

  return debugMesh;
}

const addReferenceMesh = () => {
  const refGeometry = new THREE.PlaneGeometry(1, 1, 10, 10);
  const refMaterial = new THREE.MeshStandardMaterial({
    wireframe: true,
    color: 'magenta'
  });

  const refMesh = new THREE.Mesh(refGeometry, refMaterial);
  refMesh.scale.set(planeScale / 2, planeScale / 2, planeScale / 2);
  refMesh.rotation.x = Math.PI * -0.5
  scene.add(refMesh);

  return refMesh;
}

const removeReferenceMesh = (refMesh) => {
  scene.remove(refMesh);
}

const getMeshVertexPositions = (mesh) => {
  const posArray = [];
  const geo =  mesh.geometry;
  console.log('Get vertex postions', geo);

  let positions = geo.attributes["position"].array;
    let ptCout = positions.length / 3;
    for (let i = 0; i < ptCout; i++)
    {
        let p = new THREE.Vector3(positions[i * 3], positions[i * 3 + 2], positions[i * 3 + 1]);
        posArray.push(p);
    }

    return posArray;
};

export default generateScene;

export {
  addBoxMesh,
  addSphereMesh,
  addDebugMesh,
  addReferenceMesh,
  removeReferenceMesh,
  getMeshVertexPositions
};

