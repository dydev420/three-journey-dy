import { Center, OrbitControls, Sparkles, shaderMaterial, useGLTF, useTexture } from '@react-three/drei'
import { Color } from 'three';
import { extend, useFrame } from '@react-three/fiber';
import portalVertexShader from './shaders/portal/vertex.glsl';
import portalFragmentShader from './shaders/portal/fragment.glsl';
import { Suspense, useRef } from 'react';

const PortalMaterial = shaderMaterial(
    {
        uTime: 0,
        uColorStart: new Color("#ffccff"),
        uColorEnd:new Color("#000000")
    },
    portalVertexShader,
    portalFragmentShader
);
extend({ PortalMaterial });


export default function Experience()
{
    const portalMaterial = useRef();

    const { nodes } = useGLTF('./model/portal.glb');

    const bakedTexture = useTexture('./model/baked.jpg');
    bakedTexture.flipY = false;

    useFrame((state, delta) => {
        portalMaterial.current.uTime += delta * 0.5;
    });

    return <>

        <color args={['#030202']} attach="background" />

        <OrbitControls makeDefault />

        <Suspense fallback={'Loading'}>

            <Center>
                <mesh geometry={nodes.baked.geometry}>
                    <meshBasicMaterial map={bakedTexture} />
                </mesh>

                <mesh
                    geometry={ nodes.poleLightA.geometry }
                    position={ nodes.poleLightA.position }
                    rotation={ nodes.poleLightA.rotation }
                    scale={ nodes.poleLightA.scale }
                >
                    <meshBasicMaterial color="#ffffe5" />
                </mesh>

                <mesh
                    geometry={ nodes.poleLightB.geometry }
                    position={ nodes.poleLightB.position }
                    rotation={ nodes.poleLightB.rotation }
                    scale={ nodes.poleLightB.scale }
                >
                    <meshBasicMaterial color="#ffffe5" />
                </mesh>

                <mesh
                    geometry={ nodes.portalLight.geometry }
                    position={ nodes.portalLight.position }
                    rotation={ nodes.portalLight.rotation }
                    scale={ nodes.portalLight.scale }
                >
                    <portalMaterial ref={portalMaterial} />
                </mesh>

                <Sparkles
                    size={6}
                    scale={[4, 2, 4]}
                    position-y={1}
                    speed={0.25}
                    count={40}
                />
            </Center>
        </Suspense>


    </>
}