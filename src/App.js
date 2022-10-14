
import { Html, PerspectiveCamera, RoundedBox } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react';
import './App.css'
import Model from './models/Model';

function Embed({ setClosedModal }) {

  const closeModalHandler = () => {
    setClosedModal(true)
  }
  return (
    <div className="flex-center flex-col relative pt-lg">
      <h1 className="text-white text-lg">Hi, stranger</h1>
      <div className="flex flex-row  gap-1 mt-md  text-white text-md">
        <p>Sign up now, and get a</p>
        <div className="animate-bounce">
          <b>30% discount</b>
        </div>
      </div>
      <div className="flex gap-1 flex-row mt-md-2x">
        <button className="hovered-scale outline-white">Login</button>
        <button className="hovered-scale white">Sign up now</button>
      </div>
      <div onClick={closeModalHandler} className="close-modal-icon" />
    </div>
  )
}

function Scene({ portal, ...props }) {

  const [closedModal, setClosedModal] = useState(false)
  const groupRef = useRef(null);
  const htmlRef = useRef(null);
  let rotationXDirection = 1;
  let frameCounter = 0;
  useFrame(() => {
    if (closedModal) {
      frameCounter++;
      if (groupRef.current.scale.x > 0) {
        groupRef.current.scale.x -= 0.001 * frameCounter * 0.10
        groupRef.current.scale.y -= 0.001 * frameCounter * 0.10
        groupRef.current.scale.z -= 0.001 * frameCounter * 0.10
        groupRef.current.rotation.y += 0.005 * frameCounter * 0.1
        !htmlRef.current.style.opacity && (htmlRef.current.style.opacity = 1)
        htmlRef.current.style.opacity > 0 && (htmlRef.current.style.opacity -= 0.01)
      } else {
        groupRef.current.scale.x = 0
        groupRef.current.scale.y = 0
        groupRef.current.scale.z = 0
      }
    }

    if (!closedModal) {
      if (groupRef.current.rotation.y > 0.15) rotationXDirection = -1
      if (groupRef.current.rotation.y < -0.15) rotationXDirection = 1
      groupRef.current.rotation.y += 0.0005 * rotationXDirection
    }

  })

  return <group position={[0, 0, 0]} ref={groupRef} {...props}>
    <RoundedBox position={[0, 0, 0]} args={[6.4, 4.3, 3]} radius={0.60} smoothness={60}>
      <meshPhysicalMaterial emissive="#000000" reflectivity={0.4} metalness={0.5} roughness={0.6} color="#7D4AEA" />
    </RoundedBox>
    <Html ref={htmlRef} occlude={[groupRef]} position={[0, 0, 2.0001]} scale={0.50} portal={portal} transform >
      <Embed setClosedModal={setClosedModal} />
    </Html>
  </group>

}


function App() {
  const domContent = useRef()

  return (
    <div className="wh-sc">
      {/* 3D Modal  */}
      <div className="fixed-center">
        <Canvas>
          <ambientLight />
          <pointLight position={[-10, 0, 10]} />
          <PerspectiveCamera makeDefault fov={80} position={[0, 0, 10]} />
          <Scene portal={domContent} position={[0, 0, 0]} />
          <Model />
        </Canvas>
      </div>
    </div>
  )

}
export default App