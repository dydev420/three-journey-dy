import * as CANNON from 'cannon-es';


// Phys Materials
const defaultMaterial = new CANNON.Material('default');

let world = null;

const dominoParams = {
  width: 0.6,
  height: 1,
  depth: 0.2,
};

const physicProps = {
  restitution: 0,
  friction: 0.005,
  forceStrength: 10,
};

const generatePhysWorld = () => {
  /**
   * Physics
   */
  // World
  if(!world) {
    world = new CANNON.World();
  }
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.allowSleep = true;
  world.gravity.set(
      0,
      -9.82,
      0
  );
  
  
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

  return world;
}

const addBoxBody = (position) => {
  const  {
    width,
    height,
    depth
  } = dominoParams;

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
  // body.addEventListener('collide', playHitSound);
  return body;
}


export default generatePhysWorld;

export {
  addBoxBody
};
