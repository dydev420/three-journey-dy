import * as THREE from 'three';

import Experience from "../Experience";

export class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    const testMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshBasicMaterial({
        wireframe: true
      })
    )


    this.scene.add(testMesh);
  }

  update = () => {
    
  }
}

export default World;