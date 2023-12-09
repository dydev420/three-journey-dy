import * as THREE from 'three';

import Experience from '../Experience';
import Particle from '../Particle/Particle';

export class Party {
  constructor() {

    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.particles = [];

    // Setup
    this.partyParams = {};

    // Debug
    if(this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Particles');
    }
    
    this.setParams();
    this.setParticles();
    this.setGeometry();
    this.setMaterial();
    this.setParty();
  }

  setParams = () => {
    this.partyParams.count = 200;
    this.partyParams.size = 0.1;
    this.partyParams.color = '#0084FF';
    this.partyParams.gravityScale = 0.000001;

    // Debug particles
    if(this.debug.active) {
      this.debugFolder
        .add(this.partyParams, 'count')
        .min(1)
        .max(1000)
        .step(1)
        .onChange((value) => {
          this.partyParams.count = value;
        });

      this.debugFolder
        .add(this.partyParams, 'gravityScale')
        .min(0.0000001)
        .max(10)
        .step(0.0000001)
        .onChange((value) => {
          this.partyParams.gravityScale = value;
        });;
    }
  }

  setParticles = () => {
    // Intial postions array
    this.positions = new Float32Array(this.partyParams.count * 3);

    for (let i = 0; i < this.partyParams.count; i++) {
      const particle = new Particle(i);
      
      this.particles.push(particle);
      
      this.setParticlePosition(particle);
      this.setParticleGraviy(particle);

      // Copy instace values to psotions array
      this.writeParticlePostion(particle);

    }
  }

  setGeometry = () => {
    this.geometry = new THREE.BufferGeometry();

    // Set postions array as buffer attribute
    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.positions, 3)
    );
  }

  setMaterial = () => {
    this.material = new THREE.PointsMaterial({
      color: this.partyParams.color,
      sizeAttenuation: true,
      size: this.partyParams.size
    })
  }

  setParty = () => {
    this.instance = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.instance);
  }

  writeParticlePostion = (particle) => {
    const i3 = particle.index * 3;

    // Copy postion from instance to buffer
    this.positions[i3    ] = particle.pos.x;
    this.positions[i3 + 1] = particle.pos.y;
    this.positions[i3 + 2] = 0.0;
  }

  setParticlePosition = (particle) => {
    // Intialized as random position
    particle.setRandomPos();
  }

  setParticleGraviy = (particle) => {
    particle.setGravityAcc(this.partyParams.gravityScale);
  }

  update = () => {
    // Update particle states
    this.particles.forEach((particle) => {
      // particle.setRandomVel();
      particle.update(this.time.delta);

      this.writeParticlePostion(particle);
    });

    // Update buffer attributes
    this.geometry.attributes.position.needsUpdate = true;
  }

}

export default Party;