import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Experience } from '../components/Experience';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

const MainPage = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center w-full h-screen">🌀Loading...</div>}>
    <div className="background-container">
    <div className="background-effect-container animate-fadeIn"></div>
    
    <div className="content-container animate-fadeIn relative">
    <p className="subtitle animate-rise ">不動産物件情報サイト</p>
        <h1 className="title animate-rise">LIVING HUB</h1>
        
        <p className="description animate-rise">共通の趣味やライフスタイルに合わせた物件を提供します。<br />
同じ趣味や興味を持つ人々が集まるコミュニティを形成し、<br/>快適な住生活をサポートします。</p>

        <Link to="http://127.0.0.1:8000/stores/property_list/">
          <button className="explore-button animate-rise">
            エリアから探す
          </button>
        </Link>
    </div>




   
  
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Canvas shadows camera={{ position: [30, 30, 30], fov: 30 }}>
          <color attach="background" args={["#B8CA80"]} />
          
          <Experience />
          {/* <axesHelper args={[50]} />  */}
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
