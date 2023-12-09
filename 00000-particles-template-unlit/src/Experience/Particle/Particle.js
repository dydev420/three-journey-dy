import * as THREE from 'three';

export class Particle {
  constructor(index) {
    if(index === undefined) {
      console.error('No Index defined for Particle contructor');
    }

    this.index = index;

    this.pos = new THREE.Vector3();
    this.vel = new THREE.Vector3();
    this.acc = new THREE.Vector3();
  }

  setPos = (position) => {
    this.pos.x = position.x;
    this.pos.y = position.y;
    this.pos.z = position.z;
  }

  setVel = (velocity) => {
    this.vel.x = velocity.x || 0;
    this.vel.y = velocity.y || 0;
    this.vel.z = velocity.z || 0;
  }

  setAcc = (acceleration) => {
    this.acc.x = acceleration.x || 0;
    this.acc.y = acceleration.y || 0;
    this.acc.z = acceleration.z || 0;
  }

  setRandomPos = () => {
    const newPos = {
      x: (Math.random() - 0.5) * 3,
      y: (Math.random() - 0.5) * 3
    };
    
    this.setPos(newPos);
  }

  setRandomVel = () => {
    const newVel = {
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01
    };
    
    this.setVel(newVel);
  }

  setRandomAcc = () => {
    const newAcc = {
      x: (Math.random() - 0.5) * 0.00001,
      y: (Math.random() - 0.5) * 0.00001
    };
    
    this.setAcc(newAcc);
  }

  setGravityAcc = (scale) => {
    const newAcc = {
      x: 0,
      y: -9.81 * (scale || 0.00001)
    };
    
    this.setAcc(newAcc);
  }

  update = () => {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }
}

export default Particle;