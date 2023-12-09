import { extend, useFrame, useThree } from '@react-three/fiber';
import React, { useRef } from 'react';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import CustomModel from './CustomModel';

extend({ OrbitControls }); // converts OrbitControls to orbitControls jsx

function Experience() {
  const { camera, clock, gl } = useThree();

  const roundGroupRef = useRef();
  const cubeRef = useRef();

  useFrame((state, delta) => {
    // console.log('frame' ,delta);

    // state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 8;
    // state.camera.position.z = Math.cos(state.clock.elapsedTime * 0.5) * 8;
    // camera.lookAt(0, 0, 0);


    // roundGroupRef.current.rotation.x += 0.003;
    cubeRef.current.rotation.y += delta;

    // camera.position.y += delta
  });
  console.log('render');

  return (
    <>
      <orbitControls args={ [camera, gl.domElement] } />

      <ambientLight intensity={1.5 } />

      <directionalLight intensity={ 4.5 } position={ [1, 2, 3] } />

      <group ref={ roundGroupRef }>
        <mesh
          ref={cubeRef}
          scale={ 1.5 }
          position={ [-2, 0, 0] }
          rotation-y={Math.PI * 0.25}
          >
          <boxGeometry args={ [1.5, 1.5, 1.5] }/>
          <meshStandardMaterial color="orange" />
        </mesh>
        <mesh
          position={ [2, 0, 0] }
          >
          <sphereGeometry args={ [1, 32, 32] }/>
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </group>
      <mesh
        position-y={ -1 }
        scale={ 10 }
        rotation-x={ -Math.PI * 0.5 }
        >
        <planeGeometry />
        <meshStandardMaterial color="aqua" />
      </mesh>

      <CustomModel triangleCount={10} />
    </>
  );
}

export default Experience;
