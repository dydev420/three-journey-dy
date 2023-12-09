import { OrbitControls, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { CuboidCollider, CylinderCollider, InstancedRigidBodies, Physics, RigidBody } from '@react-three/rapier'
import { Perf } from 'r3f-perf'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Euler, Matrix4, Quaternion, Vector3 } from 'three';

export default function Experience()
{
    const cubeCount = 100;
    // const cubes = useRef();

    const [hitSound, setHitSound] = useState(() => new Audio('./hit.mp3'));

    const burger = useGLTF('./hamburger.glb');

    const cube = useRef();
    const twister = useRef();

    const cubeJump = () => {
        const mass = cube.current.mass();
        cube.current.applyImpulse({
            x: 0,
            y: 5 * mass,
            z: 0
        });
        cube.current.applyTorqueImpulse({
            x: Math.random() - 0.5,
            y: Math.random() - 0.5,
            z: Math.random() - 0.5
        });
    };

    const cubeCollisionEnter = () => {
        // hitSound.currentTime = 0;
        // hitSound.volume = Math.random();
        // hitSound.play();
    }

    const twisterCollisionEnter = () => {
    }

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        const eulerRotation = new Euler(0, time * 3, 0);
        const quaternionRotation = new Quaternion();
        quaternionRotation.setFromEuler(eulerRotation);
        twister.current.setNextKinematicRotation(quaternionRotation);

        const angle = time * 0.5;
        const radius = 2.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        twister.current.setNextKinematicTranslation({x: x, y: -0.7, z: z })
    });

    const instances = useMemo(() => {
        const instances = [];

        for (let i = 0; i < cubeCount; i++) {
            instances.push({
                key: `instance_${i}`,
                position: [
                    (Math.random() -0.5) * 8,
                    6 + i * 0.2,
                    (Math.random() -0.5) * 8,
                ],
                rotation: [Math.random(), Math.random(), Math.random()]
            });
        }

        return instances;
    }, []);

    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
        <ambientLight intensity={ 1.5 } />

        <Physics
            debug={false}
            gravity={[0, -9.08, 0]}
        >
            <RigidBody colliders="ball">
                <mesh castShadow position={ [ -1.5, 2, 0 ] }>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>

            <RigidBody
                ref={cube}
                position={ [ 1.5, 2, 0 ] }
                gravityScale={1}
                restitution={0.5}
                friction={0.7}
                colliders={false}
                onCollisionEnter={cubeCollisionEnter}
            >
                <CuboidCollider mass={2} args={[0.5, 0.5, 0.5]} />
                <mesh castShadow onClick={cubeJump}>
                    <boxGeometry />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
            </RigidBody>

            <RigidBody
                ref={twister}
                position={ [ 0, - 0.7, 0 ] }
                friction={0}
                type="kinematicPosition"
                onCollisionEnter={twisterCollisionEnter}
            >
                <mesh castShadow scale={[0.4, 0.4, 4]}>
                    <boxGeometry />
                    <meshStandardMaterial color="red" />
                </mesh>
            </RigidBody>


            <RigidBody
                type="fixed"
                friction={0.7}
            >
                <mesh receiveShadow position-y={ - 1.25 }>
                    <boxGeometry args={ [ 10, 0.5, 10 ] } />
                    <meshStandardMaterial color="greenyellow" />
                </mesh>
            </RigidBody>
            
            <RigidBody
                position={[0, 4, 0]}
                colliders={false}
            >
                <CylinderCollider args={[0.4, 1]}/>
                <primitive object={burger.scene} scale={0.2} />
            </RigidBody>

            <RigidBody
                type="fixed"
                friction={0.7}
            >
                    <CuboidCollider args={ [ 5, 2, 0.5 ] } position={ [0, 1, 5.5] } />
                    <CuboidCollider args={ [ 5, 2, 0.5 ] } position={ [0, 1, -5.5] } />
                    <CuboidCollider args={ [ 0.5, 2, 5 ] } position={ [5.5, 1, 0] } />
                    <CuboidCollider args={ [ 0.5, 2, 5 ] } position={ [-5.5, 1, 0] } />
            </RigidBody>

            <InstancedRigidBodies instances={instances}>
                <instancedMesh castShadow args={[ null, null, cubeCount ]}>
                    <boxGeometry />
                    <meshStandardMaterial color={"tomato"} />
                </instancedMesh>
            </InstancedRigidBodies>


        </Physics>
    </>
}