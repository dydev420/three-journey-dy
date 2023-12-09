import { Center, OrbitControls, Text3D, useMatcapTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { Perf } from 'r3f-perf'
import { useEffect, useRef, useState } from 'react';

import * as THREE from "three";

const torusGeometry = new THREE.TorusGeometry(1, 0.6, 16, 32);
const material = new THREE.MeshMatcapMaterial();

export default function Experience()
{
    
    const donuts = useRef([]);

    const [ matcapTexture ] = useMatcapTexture('487FC9_A8E7F8_88CCF2_70AFDE', 256);
    
    useEffect(() => {

        matcapTexture.colorSpace = THREE.SRGBColorSpace;
        matcapTexture.needsUpdate = true;

        material.matcap = matcapTexture;
        material.needsUpdate = true;
    }, []);
    
    useFrame((state, delta) => {
        donuts.current.forEach(element => {
            element.rotation.x += 0.5 * delta;
            element.rotation.y += 0.5 * delta;
        });
    });

    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <Center>
            <Text3D
                font={'./fonts/helvetiker_regular.typeface.json'}
                size={0.75}
                height={0.2}
                curveSegments={16}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={0.02}
                bevelOffset={0}
                bevelSegments={6}
                material={material}
            >
                GG
            </Text3D>
        </Center>

        {
            [...Array(100)].map((v, i) => 
                <mesh
                    key= { i }
                    ref={(c) => {
                        donuts.current[i] = c;
                    }}
                    geometry={torusGeometry}
                    material={material}
                    position={[
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 10,
                    ]}
                    rotation={[
                        (Math.random() - 0.5) * 5,
                        (Math.random() - 0.5) * 5,
                        (Math.random() - 0.5) * 5,
                    ]}
                    scale={ 0.1 + Math.random() * 0.1}
                /> 
            )
        }

    </>
}