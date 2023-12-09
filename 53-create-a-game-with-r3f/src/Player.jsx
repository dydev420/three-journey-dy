import { RigidBody } from "@react-three/rapier";

function Player() {
  return (
    <>
      <RigidBody
        canSleep={false}
        // colliders="hull"
        colliders="ball"
        position={ [0, 1, 0] }
        restitution={0.2}
        friction={1}
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
