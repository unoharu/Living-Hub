import React, { useEffect, useRef } from 'react';
import { Canvas, useThree, extend } from '@react-three/fiber';
import { useGLTF, useAnimations, CameraControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { City } from './city'; // 가정: City 컴포넌트는 별도 파일에서 정의됨
import { degToRad } from 'three/src/math/MathUtils';

// DirectionalLight를 extend 함수를 사용하여 컴포넌트로 확장
extend({ DirectionalLight: THREE.DirectionalLight });

function DirectionalLightWithHelper({ color = 'white', intensity = 1, position = [100, 100, 100] }) {
  const lightRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    const helper = new THREE.DirectionalLightHelper(lightRef.current, 5, color);
    // scene.add(helper);

    // Cleanup function
    return () => {
      if (helper) {
        scene.remove(helper);
      }
    };
  }, [scene, color]);

  return (
    <directionalLight
      ref={lightRef}
      castShadow
      intensity={2}
      position={position}
      shadow-camera-left={-50}
      shadow-camera-right={50}
      shadow-camera-top={50}
      shadow-camera-bottom={-50}
      shadow-camera-near={0.5}
      shadow-camera-far={250}
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
    />
  );
}

export const Experience = () => {
    const controls = useRef();

    const intro = async () => {
        controls.current.dolly(-300);
        controls.current.smoothTime = 1.3;
        controls.current.dolly(300, true);
    }

    useEffect(() => {
        intro();
    }, []);

    return (
      <>
        <CameraControls ref={controls} />
        
        <group rotation-y={degToRad(270)} rotation-x={degToRad(0)} rotation-z={degToRad(0)} position-x={-10} position-y={-3.5}>
        
          <City scale={0.38}/>
          
        </group>
        

        {/* DirectionalLightWithHelper 컴포넌트 사용 */}
        <DirectionalLightWithHelper
          intensity={1}
          position={[100, 100, 100]}
          color="orenge"
        />

        <Environment preset="sunset" />
      </>
    );
};

// MainPage 컴포넌트 및 기타 필요한 코드는 변경 없이 유지합니다.
