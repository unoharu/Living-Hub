import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Experience } from '../components/Experience';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
 
const MainPage = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center w-full h-screen">🌀Loading...</div>}>
    <div className="background-container">

 
 
 
 
   
  
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Canvas shadows camera={{ position: [30, 30, 30], fov: 30 }}>
          <color attach="background" args={["#B8CA80"]} />
          
          <Experience />
          {/* <axesHelper args={[50]} /> */}
          <EffectComposer>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} />
      </EffectComposer>
        </Canvas>
      </div>
    
    </div>
    </Suspense>
  );
};
 
export default MainPage;