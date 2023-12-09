import * as THREE from 'three';

import React, { useEffect, useMemo, useRef } from 'react'

function CustomModel({
  triangleCount
}) {
  const geometryRef = useRef();

  const verticesCount = triangleCount * 3;
  const positions = useMemo(() => {
    return new Float32Array(verticesCount * 3);
  }, [verticesCount]);

  for( let i =0; i< verticesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 2;
  }

  useEffect(() => {
    geometryRef.current.computeVertexNormals()
  }, []);

  return (
    <mesh>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={ verticesCount }
          itemSize={ 3 }
          array={positions }
        />
      </ bufferGeometry>
      <meshStandardMaterial color="red" side={ THREE.DoubleSide }/>
    </mesh>
  )
}

export default CustomModel;
