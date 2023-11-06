import * as CANNON from 'cannon-es';

const speed = 40;
const zShake = 50;

const generateSnowflake = (lastSpawnPosition) => {
  const newPosition = {
    x: lastSpawnPosition.x,
    y: lastSpawnPosition.y,
    z: lastSpawnPosition.z,
  };

  return newPosition;
};


const finished = (x) => {
  return x < 0;
}

const animateBody = (item) => {
  if(!finished(item.body.position.x) && item.isMoving) {
    item.body.velocity.x = -speed;
    item.body.velocity.z = (Math.random() - 0.5) * zShake;
  } else {
    item.isMoving = false;
    item.body.velocity.x = 0;
    item.body.velocity.z = 0;
    item.body.type = CANNON.Body.KINEMATIC;
    // item.body.velocity
  }
}

export default generateSnowflake;

export {
  animateBody
};
