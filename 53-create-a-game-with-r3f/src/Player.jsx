import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";

function Player() {
  const body = useRef();
  const [ subscribeKeys, getKeys ] = useKeyboardControls();
  const { rapier, world } = useRapier();

  const [smoothCameraPosition] = useState(() => new Vector3(10, 10 , 10));
  const [smoothCameraTarget] = useState(() => new Vector3());

  const jump = () => {
    const jumpStrength = 0.5;
    
    const origin = body.current.translation();
    origin.y -= 0.31;

    const direction = { x: 0, y: -1, z:0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 10, true);

    if(hit.toi < 0.15) {
      body.current.applyImpulse({ x: 0, y: jumpStrength, z: 0});
    }
  }
  
  useEffect(() => {
    const unsubscribeJump =  subscribeKeys(
      // Selector
      (state) => state.jump,

      // Listener
      (value) => {
        if(value) {
          jump();
        }
      }
    );

    return () => {
      unsubscribeJump();
    };
  }, []);

  useFrame((state, delta) => {
    /**
     * Controls
     */
    const {
      forward,
      backward,
      leftward,
      rightward,
    } = getKeys();

    const impulse = { x: 0, y: 0, z: 0};
    const torque = { x: 0, y: 0, z: 0};

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if(forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }
    
    if(backward) {
      impulse.z += impulseStrength;
    }

    if(leftward) {
      impulse.x -= impulseStrength;
    }

    if(rightward) {
      impulse.x += impulseStrength;
    }

    body.current.applyImpulse(impulse);
    body.current.applyTorqueImpulse(torque);

    /**
     * Camera
     */
    const bodyPosition = body.current.translation();
    
    const cameraPosition = new Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z += 2.25;
    cameraPosition.y += 0.65;

    const cameraTarget = new Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25;

    smoothCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothCameraTarget.lerp(cameraTarget, 5 * delta);

    state.camera.position.copy(smoothCameraPosition);
    state.camera.lookAt(smoothCameraTarget);
  });

  return (
    <>
      <RigidBody
        ref={body}
        canSleep={false}
        colliders="ball"
        position={ [0, 1, 0] }
        restitution={0.6}
        friction={1}
        linearDamping={0.5}
        angularDamping={0.5}
      >
        <mesh castShadow>
          <icosahedronGeometry args={ [0.3, 1] } />
          <meshStandardMaterial flatShading color="mediumpurple" />
        </mesh>
      </RigidBody>
    </>
  )
}

export default Player;
