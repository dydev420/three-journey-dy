import * as THREE from 'three';

const generateSnowflake = (lastSpawnPosition) => {
  // const positions = [];
  const newPosition = {
    x: lastSpawnPosition.x,
    y: lastSpawnPosition.y,
    z: lastSpawnPosition.z,
  };

  while(!finished(newPosition.x, lastSpawnPosition.x)) {
    newPosition.x -= 0.01;
    newPosition.z += (Math.random() - 0.5) * 0.1;

    console.log(newPosition);
  }

 return newPosition;
};


const finished = (x, lastPos) => {
  return x < - (Math.abs(lastPos) + 1);
}

const animateBody = (item) => {
  item.body.position.x += 0.01;
  item.body.position.z += (Math.random() - 0.5) * 0.1;
}

export default generateSnowflake;

export {
  animateBody
};
