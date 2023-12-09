import * as THREE from 'three';

import Experience from "../Experience";

export class Fox {
 constructor() {
  this.experience = new Experience();
  this.scene = this.experience.scene;
  this.resources = this.experience.resources;
  this.time = this.experience.time;
  this.debug = this.experience.debug;

  // Debug
  if(this.debug.active) {
    this.debugFolder = this.debug.ui.addFolder('fox');
  }

  // Setup
  this.modelResource = this.resources.items.foxModel;

  this.setModel();
  this.setAnimation();
 }

 setModel = () => {
  this.model = this.modelResource.scene;
  this.model.scale.set(0.02, 0.02, 0.02);
  this.scene.add(this.model);

  this.model.traverse((child) => {
    if(child.isMesh) {
      child.castShadow = true;
    }
  });
 }

 setAnimation = () => {
  this.animation = {};
  this.animation.mixer = new THREE.AnimationMixer(this.model);

  this.animation.actions = {};
  this.animation.actions.idle = this.animation.mixer.clipAction(this.modelResource.animations[0]);
  this.animation.actions.walk = this.animation.mixer.clipAction(this.modelResource.animations[1]);
  this.animation.actions.run = this.animation.mixer.clipAction(this.modelResource.animations[2]);
  
  this.animation.actions.current = this.animation.actions.walk;
  this.animation.actions.current.play();

  this.animation.play = (name) => {
    const newAction = this.animation.actions[name];
    const oldAction = this.animation.actions.current;

    newAction.reset();
    newAction.play();
    newAction.crossFadeFrom(oldAction, 1);

    this.animation.actions.current = newAction;
  }

  // Debug animation
  if(this.debug.active) {
    const debugObject = {
      playIdle: () => {
        this.animation.play('idle');
      },
      playWalk: () => {
        this.animation.play('walk');
      },
      playRun: () => {
        this.animation.play('run');
      },
    };

    this.debugFolder.add(debugObject, 'playIdle');
    this.debugFolder.add(debugObject, 'playWalk');
    this.debugFolder.add(debugObject, 'playRun');
  }
 }

 update = () => {
  this.animation.mixer.update(this.time.delta * 0.001);
 }
}

export default Fox;