import * as THREE from 'three';

import Experience from "../Experience";
import Environment from './Environment';

import Party from './Party';
import Frame from './Frame';

export class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on('ready', () => {
      // Setup
      this.frame = new Frame();
      this.party = new Party();
      
      // Setup Env (After Objects)
      this.environment = new Environment();
    });
  }

  update = () => {

    if(this.party) {
      this.party.update();
    }
  }
}

export default World;