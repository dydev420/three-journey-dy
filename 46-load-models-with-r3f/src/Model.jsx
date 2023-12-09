import { useGLTF } from "@react-three/drei";

function Model() {
  const model = useGLTF('./hamburger-draco.glb');
  
  return <primitive object={model.scene} scale= { 0.35 } />
}

export default Model;
