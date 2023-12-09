import { TransformControls, OrbitControls, PivotControls, Html, Text, Float, MeshReflectorMaterial } from "@react-three/drei";
import { useRef } from "react";


export default function Experience()
{
    const cubeRef = useRef();
    const sphereRef = useRef();

    return <>
        <OrbitControls makeDefault />

        <directionalLight position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
        <ambientLight intensity={ 1.5 } />

        <PivotControls
            anchor={[0, 0, 0]}
            depthTest={false}
            lineWidth={4}
            axisColors={['#93b1ff', '#ff4d6d', '#7ae582']}
            scale={100}
            fixed={true}
        >
            <mesh ref={sphereRef} position-x={ - 2 }>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
                <Html
                    center
                    wrapperClass="label"
                    position={[1, 1, 0]}
                    distanceFactor={5}
                    occlude={[sphereRef, cubeRef]}
                >
                    The Ball
                </Html>
            </mesh>
        </PivotControls>

        <mesh ref={cubeRef} position-x={ 2 } scale={ 1.5 }>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>
        <TransformControls object={cubeRef} mode="translate"/>

        <mesh position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            {/* <meshStandardMaterial color="greenyellow" /> */}
            <MeshReflectorMaterial
                resolution={512}
                blur={[1000, 1000]}
                mixBlur={1}
                mirror={0.75}
                color="aqua"
            />
        </mesh>

        <Float
            speed={3}
            floatIntensity={2}
        >
            <Text
                font="/bangers-v20-latin-regular.woff"
                fontSize={ 1 }
                color="salmon"
                position={[0, 2, 0]}
                maxWidth={ 2 }
                textAlign="center"
            >
                SDF Fonts R3F
            </Text>
        </Float>
    </>
}