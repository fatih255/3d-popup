
import { Html, PerspectiveCamera, RoundedBox } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react';
import './App.css'
import Model from './models/Model';


const closeModalHandler = (setClosedModal) => {
  setClosedModal(true)
}

function Embed({ setClosedModal }) {


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
      <div onClick={() => closeModalHandler(setClosedModal)} className="close-modal-icon" />
    </div>
  )
}

function Scene({ portal, ...props }) {

  const [closedModal, setClosedModal] = useState(false)
  const [modalAnimationEnd, setModalAnimationEnd] = useState(false)
  const [exitIntent, setExitIntent] = useState({ mouseout: false, finishModalCloseAnimation: false })
  const groupRef = useRef(null);
  const htmlRef = useRef(null);
  let rotationXDirection = 1;
  let frameCounterForCloseModal = 0;
  let frameCounter = 0;

  const mouseLeaveHandler = () => {
    setExitIntent((prevstate) => Object({ ...prevstate, mouseout: true }))
    setClosedModal(true)
    document.removeEventListener("mouseleave", mouseLeaveHandler)
  }

  useEffect(() => {
    modalAnimationEnd && document.addEventListener("mouseleave", mouseLeaveHandler)

    return () => {
      document.removeEventListener("mouseleave", mouseLeaveHandler)
    }
  }, [modalAnimationEnd])

  useFrame((state) => {
    frameCounter++;



    if (closedModal) {

      if (groupRef.current.scale.x < 0) {
        setExitIntent((prevstate) => Object({ ...prevstate, finishModalCloseAnimation: true }))
      }
      frameCounterForCloseModal++;
      if (groupRef.current.scale.x > 0) {
        groupRef.current.scale.x -= 0.001 * frameCounterForCloseModal * 0.10
        groupRef.current.scale.y -= 0.001 * frameCounterForCloseModal * 0.10
        groupRef.current.scale.z -= 0.001 * frameCounterForCloseModal * 0.10
        groupRef.current.rotation.y += 0.005 * frameCounterForCloseModal * 0.1
        !htmlRef.current.style.opacity && (htmlRef.current.style.opacity = 1)
        htmlRef.current.style.opacity > 0 && (htmlRef.current.style.opacity -= 0.01)

      } else {
        !exitIntent && portal.current.classList.add('animate-fade-out')
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

    if (frameCounter > 280 && groupRef.current.scale.x < 1.2) {
      groupRef.current.scale.x += 0.01
      groupRef.current.scale.y += 0.01
      groupRef.current.scale.z += 0.01
    }
    if (groupRef.current.scale.x > 1.1) {
      setModalAnimationEnd(true)
    }
    if (modalAnimationEnd) {
      state.camera.position.lerp({ x: -state.pointer.x * 2, y: -state.pointer.y * 2, z: 10 }, 0.1)
      state.camera.lookAt(0, 0, 0)
      state.camera.updateProjectionMatrix()
    }


  })

  return <group>
    <group scale={[0, 0, 0]} position={[0, 0, 0]} ref={groupRef} {...props}>
      <RoundedBox position={[0, 0, 0]} args={[6.4, 4.3, 3]} radius={0.60} smoothness={60}>
        <meshPhysicalMaterial emissive="#000000" reflectivity={0.4} metalness={0.5} roughness={0.6} color="#7D4AEA" />
      </RoundedBox>
      <Html ref={htmlRef} occlude={[groupRef]} position={[0, 0, 2.0001]} scale={0.50} portal={portal} transform >
        <Embed setClosedModal={setClosedModal} />
      </Html>
    </group>
    <ExitIntentCampaing portal={htmlRef} delayFrame={50} whenOpen={exitIntent.mouseout && exitIntent.finishModalCloseAnimation} />
  </group>

}


function ExitIntentCampaing({ portal, whenOpen, delayFrame = 0 }) {
  const [ClosedModal, setClosedModal] = useState(false)
  const modal = useRef(null)
  const groupRef = useRef(null)
  let frameCounter = 0
  let frameCounterForCloseModal = 0

  useEffect(() => {
    if (!modal.current) {
      modal.current = document.querySelector('.modal')
    }
  })
  useFrame(() => {
    frameCounter++;
    if (!ClosedModal && frameCounter >= delayFrame && whenOpen && groupRef.current.scale.x < 1.2) {
      groupRef.current.scale.x += 0.01
      groupRef.current.scale.y += 0.01
      groupRef.current.scale.z += 0.01
    }
    if (ClosedModal) {

      frameCounterForCloseModal++;
      if (groupRef.current.scale.x > 0) {
        groupRef.current.scale.x -= 0.001 * frameCounterForCloseModal * 0.10
        groupRef.current.scale.y -= 0.001 * frameCounterForCloseModal * 0.10
        groupRef.current.scale.z -= 0.001 * frameCounterForCloseModal * 0.10
        groupRef.current.rotation.y += 0.005 * frameCounterForCloseModal * 0.1

        !portal.current.style.opacity && (portal.current.style.opacity = 1)
        portal.current.style.opacity > 0 && (portal.current.style.opacity -= 0.01)

      } else {
        modal.current.classList.add('animate-fade-out')
        groupRef.current.scale.x = 0
        groupRef.current.scale.y = 0
        groupRef.current.scale.z = 0
      }
    }
  })

  return <group scale={[0, 0, 0]} position={[0, -1, 0]} ref={groupRef} >
    <Html position={[0, 0, 2.0001]} scale={0.50} transform >
      <div className="intent-div flex flex-col">
        <span className="text-md" >Ok well, </span>
        <div className="flex items-center gap-1 text-2xl mt-1 ">
          <span className="font-bold text-big animate-bounce"> 45%</span>
          <span>off for you</span>
        </div>
        <button className="mt-1.5 hovered-scale primary">Look at discounted products for you</button>
      </div>
      <div onClick={() => setClosedModal(true)} className="close-modal-icon primary-color-icon" />
    </Html>
    <group>
      <Html position={[-5, 3.5, 3]} transform scale={0.24}>
        <div className="product-div">
          <div>
            <img src="assets/productimages/product-9.jpg" />
            <img src="assets/productimages/product-1.jpg" />
            <img src="assets/productimages/product-2.jpg" />
            <img src="assets/productimages/product-3.jpg" />
            <img src="assets/productimages/product-4.jpg" />
            <img src="assets/productimages/product-5.jpg" />
            <img src="assets/productimages/product-7.jpg" />
          </div>
        </div>
      </Html>
    </group>
  </group>
}


function App() {

  const domContent = useRef()

  return (
    <div className="wh-sc">

      {/* 3D Modal  */}
      <div ref={domContent} className="modal fixed-center animate-fade-in modal-style-1 ">
        <Canvas>
          <ambientLight />
          <pointLight position={[-10, 0, 10]} />
          <PerspectiveCamera makeDefault fov={80} position={[0, 0, 10]} />
          <Scene portal={domContent} position={[0, 0, 0]} />
          <Model />

        </Canvas>
      </div>
      <img src="assets/preview/ecommerce.png" />
    </div>
  )

}
export default App