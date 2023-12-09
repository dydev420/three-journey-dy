import * as THREE from 'three';

import Experience from '../Experience';

export class Frame {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry = () => {
    this.geometry = new THREE.PlaneGeometry(5, 5);
  }

  setMaterial = () => {
    this.material = new THREE.MeshBasicMaterial({
      color: '#3d3d3d'
    });
  }

  setMesh = () => {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.z = -1;
    // this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }
}

export default Frame;