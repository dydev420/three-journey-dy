import { useFrame } from '@react-three/fiber'
import { AccumulativeShadows, BakeShadows, ContactShadows, Environment, Lightformer, OrbitControls, RandomizedLight, Sky, SoftShadows, Stage, useHelper } from '@react-three/drei'
import { useRef } from 'react'
import { Perf } from 'r3f-perf'
import { DirectionalLightHelper } from 'three';
import { useControls } from 'leva';

export default function Experience()
{
    const directionalLight = useRef();
    useHelper(directionalLight, DirectionalLightHelper, 1);
    
    const cube = useRef();
    
    useFrame((state, delta) =>
    {   
        const time = state.clock.elapsedTime;

        cube.current.rotation.y += delta * 0.2
        cube.current.position.x = 2 + Math.sin(time); 
    })

    const { color, opacity, blur } = useControls('contactShadows', {
        color: '#4b2709',
        opacity: { value: 0.4, min:0, max: 1 },
        blur: { value: 2.8, min: 0, max: 10},
    });

    const { sunPosition } = useControls('sky', {
        sunPosition: { value: [1, 2, 3] }
    });

    const {
        envMapIntensity,
        envHeight,
        envRadius,
        envScale
    } = useControls('envMap', {
        envMapIntensity: { value: 1, min: 0, max: 10 },
        envHeight: { value: 7, min: 0, max: 100 },
        envRadius: { value: 28, min: 0, max: 1000 },
        envScale: { value: 100, min: 0, max: 1000 },
    })
    

    return <>
        {/* <BakeShadows /> */}
        {/* <SoftShadows size={ 25 } samples={ 20 } focus={ 0 } /> */}

        <Environment
            // background
            ground={{
                height: envHeight,
                radius: envRadius,
                scale: envScale
            }}
            // // files={'./environmentMaps/the_sky_is_on_fire_2k.hdr'}
            preset='sunset'
        >
            {/* <color args={['#000000']}  attach="background" />

            {/* <Lightformer
                position-z={-5}
                scale={10}
                color="red"
                intensity={10}
                form="ring"
                /> */}

            {/* <mesh position-z={-5}  scale={10} >
                <planeGeometry />
                <meshBasicMaterial color={[10, 0, 0]} />
            </mesh> */}
            
        </Environment>

        {/* <color args={['#ffeeee']}  attach="background" /> */}
        
        <Perf position="top-left" />

        <OrbitControls makeDefault />

        {/* <AccumulativeShadows
            position={[0, -0.99, 0]}
            scale={10}    
            color='#316d39'
            opacity={0.8}
            frames={Infinity}
            temporal
            blend={100}
        >
            <RandomizedLight
                amount={8}
                radius={1}
                intensity={3}
                ambient={0.5}
                position={[1, 2, 3]}
                bias={0.001}
            />
        </AccumulativeShadows> */}

        <ContactShadows
            position={[0, 0, 0]}
            scale={10}
            resolution={512}
            color={color}
            opacity={opacity}
            blur={blur}
            />
        
        {/* <directionalLight
            ref={directionalLight}
            position={ sunPosition }
            intensity={ 4.5 }
            castShadow
            shadow-mapSize= {[1024, 1024]}
            shadow-camera-near={1}    
            shadow-camera-far={10}    
            shadow-camera-top={5}    
            shadow-camera-right={5}    
            shadow-camera-bottom={-5}    
            shadow-camera-left={-5}    
        />
        <ambientLight intensity={ 1.5 } /> */}

        {/* <Sky sunPosition={sunPosition} /> */}

        <mesh position-x={ - 2 } position-y={1} castShadow>
            <sphereGeometry />
            <meshStandardMaterial color="orange" envMapIntensity={envMapIntensity} />
        </mesh>

        <mesh ref={ cube } position-x={ 2 } position-y={1} scale={ 1.5 } castShadow>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" envMapIntensity={envMapIntensity} />
        </mesh>

        {/* <mesh position-y={0} rotation-x={- Math.PI * 0.5} scale={10} >
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" envMapIntensity={envMapIntensity} />
        </mesh> */}

        {/* <Stage
            shadows={{
                type: 'contact',
                opacity: 0.2,
                blur: 3
            }}
            environment="sunset"
            preset="portrait"
            intensity={6}
        >
            <mesh position-x={ - 2 } position-y={1} castShadow>
                <sphereGeometry />
                <meshStandardMaterial color="orange" envMapIntensity={envMapIntensity} />
            </mesh>

            <mesh ref={ cube } position-x={ 2 } position-y={1} scale={ 1.5 } castShadow>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" envMapIntensity={envMapIntensity} />
            </mesh>
        </Stage> */}
    </>
}