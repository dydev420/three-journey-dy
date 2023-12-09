import './style.css'
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import Experience from './Experience/Experience';

const root = ReactDOM.createRoot(document.querySelector('#root'));

const cameraSettings = {
  fov: 45,
  near: 0.1,
  far: 200,
  position: [3, 2, 6]
};

const renderSettings = {};

root.render(
  <>
    <Canvas
    // flat
    gl={{
      // antialias: false,
    }}
      camera={ cameraSettings }
    >
      <Experience />
    </Canvas>
  </>
)