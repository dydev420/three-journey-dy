import * as THREE from 'three';

const dominoParams = {
  width: 0.6,
  height: 1,
  depth: 0.2,
};

const initialSpawnLocation = {
  x: 0,
  y: 0.5,
  z: 0
}

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

const generateDomino = (position) => {
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

  // -------@@@@@@@
  world.addBody(body);

  // listen to coliide events
  // body.addEventListener('collide', playHitSound);

  // Save in objects to update
  objectsToUpdate.push({
      mesh,
      body
  });

  updateLastSpawnLoacation();
};

export default generateDomino;
