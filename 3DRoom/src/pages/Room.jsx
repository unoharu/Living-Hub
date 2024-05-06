import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Vector3, Euler,  Quaternion} from 'three';

const cameraPositions = [
  { position: new Vector3(0, -0.4, 5), target: new Vector3(0, 0, 0), rotation: [0, 0, 0] }, // Euler(x, y, z)
  { position: new Vector3(0.3, -0.4, 0), target: new Vector3(0, 0, 0), rotation: [0, Math.PI / -3.5, 0] },
  { position: new Vector3(0.1, -0.4, -3.4), target: new Vector3(0, 0, 0), rotation: [0, Math.PI / 3.5, 0] },
  { position: new Vector3(0, 2.5, -4.5), target: new Vector3(0, 0, 0), rotation: [Math.PI / 5, Math.PI / 1, 0] },
  { position: new Vector3(0, 10, 0), target: new Vector3(0, 0, 0), rotation: [-Math.PI / 2, 0, Math.PI] },
];



// Hewroom 컴포넌트 정의
export function Hewroom(props) {
  const { nodes, materials } = useGLTF('/hewroom.glb');


  return (
    <group {...props} dispose={null}>
      <group scale={0.01}>
        <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.bed_frame_bed_frame_0.geometry} material={materials.bed_frame} />
          <mesh geometry={nodes.bed_frame_bed_light_0.geometry} material={materials.bed_light} />
        </group>
        <group position={[-184.785, 442.107, -280.968]} rotation={[0, 0, -Math.PI]} scale={[34.779, 32.712, 24.154]}>
          <mesh geometry={nodes.bed_head_bedhead_light_0.geometry} material={materials.bedhead_light} />
          <mesh geometry={nodes.bed_head_bedhead_lightgrey_0.geometry} material={materials.bedhead_lightgrey} />
          <mesh geometry={nodes.bed_head_bedhead_wood_0.geometry} material={materials.bedhead_wood} />
          <mesh geometry={nodes.bed_head_bedhead_wooddec_0.geometry} material={materials.bedhead_wooddec} />
          <mesh geometry={nodes.bed_head_bedhead_woodlight_0.geometry} material={materials.bedhead_woodlight} />
        </group>
        <group position={[-608.267, 106.634, 204.032]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.branch_bathroom_branch_bathroom_0.geometry} material={materials.branch_bathroom} />
          <mesh geometry={nodes.leaves002_leaf_bathroom_0.geometry} material={materials.leaf_bathroom} />
        </group>
        <group position={[-26.525, 99.614, -4.004]} rotation={[-Math.PI / 2, 0, -0.896]} scale={[88.569, 88.569, 75.055]}>
          <mesh geometry={nodes.branch_dining_table_branch_dining_table_0.geometry} material={materials.branch_dining_table} />
          <mesh geometry={nodes.leaves003_leaf_dining_table_0.geometry} material={materials.leaf_dining_table} />
        </group>
        <group position={[226.343, 18.622, 164.167]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.branch_sofaside_branch_sofaside_0.geometry} material={materials.branch_sofaside} />
          <mesh geometry={nodes.leaves001_leaf_sofaside_0.geometry} material={materials.leaf_sofaside} />
        </group>
        <group position={[-415.67, 363.994, 194.56]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.cabinet_2nd_floor_cabinet_2nd_floor_white_0.geometry} material={materials.cabinet_2nd_floor_white} />
          <mesh geometry={nodes.cabinet_2nd_floor_cabinet_grey_2nd_floor_0.geometry} material={materials.cabinet_grey_2nd_floor} />
          <mesh geometry={nodes.cabinet_2nd_floor_cabinet_light_2nd_floor_0.geometry} material={materials.cabinet_light_2nd_floor} />
        </group>
        <group position={[-629.188, 483.673, 78.719]} rotation={[-Math.PI / 2, 0, 0]} scale={0.852}>
          <mesh geometry={nodes.candle__candle_body_0.geometry} material={materials.candle_body} />
          <mesh geometry={nodes.candle__candle_body_0001.geometry} material={materials.candle_body} />
          <mesh geometry={nodes.candle__candle_0.geometry} material={materials.candle} />
        </group>
        <group position={[466.91, 250.709, -59.213]} rotation={[-Math.PI / 2, 0, 0]} scale={[100, 100, 131.549]}>
          <mesh geometry={nodes.ceiling_lamp_ceiling_lamp_grey_0.geometry} material={materials.ceiling_lamp_grey} />
          <mesh geometry={nodes.ceiling_lamp_ceiling_lamp_white_0.geometry} material={materials.ceiling_lamp_white} />
        </group>
        <group position={[-162.929, 94.586, -281.623]} rotation={[-1.81, 0, 0]} scale={[100, 100, 104.354]}>
          <mesh geometry={nodes.chopping_board_chopping_board1_0.geometry} material={materials.chopping_board1} />
          <mesh geometry={nodes.chopping_board_chopping_board2_0.geometry} material={materials.chopping_board2} />
        </group>
        <group position={[374.667, 42.169, 23.464]} rotation={[-Math.PI / 2, 0, 0]} scale={3.07}>
          <mesh geometry={nodes.dec_sofaside_dec_sofaside1_0.geometry} material={materials.dec_sofaside1} />
          <mesh geometry={nodes.dec_sofaside_dec_sofaside2_0.geometry} material={materials.dec_sofaside2} />
        </group>
        <group position={[198.909, 142.521, -274.971]} rotation={[-Math.PI / 2, 0, 0]} scale={[24.23, 24.23, 29.119]}>
          <mesh geometry={nodes.floor_lamp_floor_lamp001_0.geometry} material={materials['floor_lamp.001']} />
          <mesh geometry={nodes.floor_lamp_floor_lamp001_0001.geometry} material={materials['floor_lamp.001']} />
          <mesh geometry={nodes.floor_lamp_floor_lamp001_0002.geometry} material={materials['floor_lamp.001']} />
          <mesh geometry={nodes.floor_lamp_floor_lamp001_0003.geometry} material={materials['floor_lamp.001']} />
        </group>
        <group position={[-364.595, 84.473, -275.196]} rotation={[-Math.PI / 2, 0, 0.11]} scale={4.851}>
          <mesh geometry={nodes.jar_jar1_0.geometry} material={materials.jar1} />
          <mesh geometry={nodes.jar_jar2_0.geometry} material={materials.jar2} />
        </group>
        <group position={[-643.485, 201.071, 54.268]} rotation={[-Math.PI / 2, -Math.PI / 2, 0]} scale={[46.475, 46.475, 5.187]}>
          <mesh geometry={nodes.metal_bathroom_metal_bathroom_0.geometry} material={materials.metal_bathroom} />
          <mesh geometry={nodes.metal_bathroom_mirror_light_0.geometry} material={materials.mirror_light} />
          <mesh geometry={nodes.metal_bathroom_mirror_0.geometry} material={materials.mirror} />
        </group>
        <group position={[-633.85, 426.221, 132.389]} rotation={[-Math.PI / 2, -0.085, Math.PI]} scale={[1.049, 26.325, 26.325]}>
          <mesh geometry={nodes.painting_2nd_floor_painting_2nd_floor1_0.geometry} material={materials.painting_2nd_floor1} />
          <mesh geometry={nodes.painting_2nd_floor_painting_2nd_floor2_0.geometry} material={materials.painting_2nd_floor2} />
          <mesh geometry={nodes.painting_2nd_floor_painting_frame_grey_2nd_floor_0.geometry} material={materials.painting_frame_grey_2nd_floor} />
          <mesh geometry={nodes.painting_2nd_floor_painting_frame_white_2nd_floor_0.geometry} material={materials.painting_frame_white_2nd_floor} />
        </group>
        <group position={[226.273, 98.685, 234.243]} rotation={[-1.493, 0, -Math.PI / 2]} scale={[3.837, 96.331, 96.331]}>
          <mesh geometry={nodes.paiting_1st_floor_painting_doorside_0.geometry} material={materials.painting_doorside} />
          <mesh geometry={nodes.paiting_1st_floor_painting_frame_white_0.geometry} material={materials.painting_frame_white} />
          <mesh geometry={nodes.paiting_1st_floor_painting_sofa_side_0.geometry} material={materials.painting_sofa_side} />
        </group>
        <group position={[0, 0, -0.692]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.refrigerator_refrigerator_handle_0.geometry} material={materials.refrigerator_handle} />
          <mesh geometry={nodes.refrigerator_refrigerator_0.geometry} material={materials.refrigerator} />
        </group>
        <group position={[-0.749, 75, 141.184]} rotation={[-Math.PI / 2, 0, Math.PI]} scale={[100, 100, 52.08]}>
          <mesh geometry={nodes.seat_1st_floor_seat_1st_floor_0.geometry} material={materials.seat_1st_floor} />
          <mesh geometry={nodes.seat_1st_floor_seat_leg_1st_floor_0.geometry} material={materials.seat_leg_1st_floor} />
        </group>
        <group position={[-477.002, 334.619, 134.74]} rotation={[-Math.PI / 2, 0, 0]} scale={[100, 100, 105.252]}>
          <mesh geometry={nodes.seat_2nd_floor_Material002_0.geometry} material={materials['Material.002']} />
          <mesh geometry={nodes.seat_2nd_floor_seat_2nd_floor_0.geometry} material={materials.seat_2nd_floor} />
        </group>
        <group position={[474.629, 46.626, 161.19]} rotation={[-Math.PI / 2, -Math.PI / 2, 0]} scale={[19.659, 36.064, 12.984]}>
          <mesh geometry={nodes.sofa_sofa_0.geometry} material={materials.sofa} />
          <mesh geometry={nodes.sofa_sofa_0001.geometry} material={materials.sofa} />
          <mesh geometry={nodes.sofa_sofa_0002.geometry} material={materials.sofa} />
        </group>
        <group position={[288.84, 295.889, 245.406]} rotation={[-Math.PI / 2, 0, 0]} scale={[117.038, 4.947, 4.167]}>
          <mesh geometry={nodes.sofahead_light_sofahead_light_0.geometry} material={materials.sofahead_light} />
          <mesh geometry={nodes.sofahead_light_sofahead_lightgrey_0.geometry} material={materials.sofahead_lightgrey} />
        </group>
        <group position={[-551.433, 264.377, -158.061]} rotation={[-Math.PI / 2, 0, 0]} scale={[6.949, 6.949, 2.136]}>
          <mesh geometry={nodes.spotlight_spot_light_fabric_0.geometry} material={materials.spot_light_fabric} />
          <mesh geometry={nodes.spotlight_spot_light_0.geometry} material={materials.spot_light} />
        </group>
        <group position={[-94.184, 283.144, -44.973]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.stair_stairs_base_0.geometry} material={materials.stairs_base} />
          <mesh geometry={nodes.stair_stairs_wood_0.geometry} material={materials.stairs_wood} />
        </group>
        <mesh geometry={nodes.bathroom_ceramic_bathroom_ceramic_0.geometry} material={materials.bathroom_ceramic} position={[-597.006, 98.5, 54.268]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.bathroom_table_bathroom_table_0.geometry} material={materials.bathroom_table} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.bathroom_wood_bathroom_wood_0.geometry} material={materials.bathroom_wood} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.bed_bed_0.geometry} material={materials.material_71} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.bedside_table_bedside_table_0.geometry} material={materials.bedside_table} position={[-25.651, 0, 4.003]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.bottle_bathroom_bottle_bathroom_0.geometry} material={materials.bottle_bathroom} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.bottle_dining_table_bottle_dining_table_0.geometry} material={materials.bottle_dining_table} position={[-26.24, 86.332, -4.524]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={8.337} />
        <mesh geometry={nodes.bottle_grey_2nd_floor_bottle_grey_2nd_floor_0.geometry} material={materials.bottle_grey_2nd_floor} position={[-630.055, 438.214, 190.809]} rotation={[Math.PI, 0, 0]} scale={-0.344} />
        <mesh geometry={nodes.bottle_sofaside_bottle_sofaside_0.geometry} material={materials.bottle_sofaside} position={[226.388, 14.415, 163.606]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={[19.921, 19.921, 12.866]} />
        <mesh geometry={nodes.bottle_white_2nd_floor_bottle_white_2nd_floor_0.geometry} material={materials.bottle_white_2nd_floor} position={[-633.798, 417.137, 174.75]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={[3.898, 3.898, 3.67]} />
        <mesh geometry={nodes.bowl_1st_floor_bowl_1st_floor_0.geometry} material={materials.bowl_1st_floor} position={[369.168, 49.794, 27.819]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={[17.6, 17.6, 13.5]} />
        <mesh geometry={nodes.bowl_2nd_floor_bowl_2nd_floor001_0.geometry} material={materials['bowl_2nd_floor.001']} position={[-629.474, 355.885, 92.45]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={[14.153, 14.153, 10.855]} />
        <mesh geometry={nodes.cabinet_1st_floor_cabinet_1st_floor_0.geometry} material={materials.cabinet_1st_floor} position={[-320.539, 2.717, -241.411]} rotation={[0, 0, Math.PI / 2]} scale={[9.786, 249.171, 2.927]} />
        <mesh geometry={nodes.carbon_carbon_0.geometry} material={materials.carbon} position={[603.259, 151.45, -238.189]} rotation={[-Math.PI / 2, 0.559, 0]} scale={5.172} />
        <mesh geometry={nodes.Carpet_1st_floor_Carpet_1st_floor_0.geometry} material={materials.Carpet_1st_floor} position={[404.054, 2.153, 81.864]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={[190.768, 245.015, 0.524]} />
        <mesh geometry={nodes.Carpet_2nd_floor_Carpet_2nd_floor_0.geometry} material={materials.Carpet_2nd_floor} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.cooking_bench_cooking_bench_0.geometry} material={materials.cooking_bench} position={[-455.039, 79.869, -256.342]} rotation={[-Math.PI / 2, 0, 0]} scale={[100, 100, 63.247]} />
        <mesh geometry={nodes.dining_table_dining_table_0.geometry} material={materials.dining_table} position={[-2.518, 65.739, 19.781]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={[80.747, 75.218, 10.763]} />
        <mesh geometry={nodes.dining_table_leg_dining_table_leg_0.geometry} material={materials.dining_table_leg} position={[-2.518, 28.946, 19.781]} rotation={[-Math.PI / 2, 0, 0]} scale={19.435} />
        <mesh geometry={nodes.door_door_0.geometry} material={materials.door} position={[-664.909, 110.606, -158.667]} rotation={[-Math.PI / 2, 0, 0]} scale={[5.154, 51.483, 108.596]} />
        <mesh geometry={nodes.extractor_hood_extractor_hood_0.geometry} material={materials.extractor_hood} position={[-455.353, 176.107, -264.685]} rotation={[-Math.PI / 2, 0, 0]} scale={[62.894, 23.949, 4.171]} />
        <mesh geometry={nodes.floor_1st_floor_1st_0.geometry} material={materials.floor_1st} position={[0, 261.293, -39.715]} rotation={[-Math.PI / 2, 0, 0]} scale={[649.271, 248.457, 260]} />
        <mesh geometry={nodes.floor_2nd_floor_2nd_0.geometry} material={materials.floor_2nd} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.glass_glass_0.geometry} material={materials.glass} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.hand_washing_sink_hand_washing_sink_0.geometry} material={materials.hand_washing_sink} position={[-233.535, 110.536, -262.684]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={[0.972, 0.972, 0.479]} />
        <mesh geometry={nodes.heater_heater_0.geometry} material={materials.heater} position={[590.803, 159.859, -253.357]} rotation={[-Math.PI / 2, 0, 0]} scale={[49.762, 49.762, 20.157]} />
        <mesh geometry={nodes.lighting_stairs_lighting_stairs_0.geometry} material={materials.lighting_stairs} position={[0, -0.905, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Marble_Marble_0.geometry} material={materials.Marble} position={[-399.528, 135.125, -290.628]} rotation={[-Math.PI / 2, 0, 0]} scale={[100, 0.274, 100]} />
        <mesh geometry={nodes.pillow_ball_pillow_ball_0.geometry} material={materials.pillow_ball} position={[538.34, 62.819, 151.675]} rotation={[-Math.PI / 2, 0.102, 0]} scale={[23.34, 24.401, 21.711]} />
        <mesh geometry={nodes.pillow_pink_pillow_pink_0.geometry} material={materials.pillow_pink} position={[339.758, 60.113, 172.459]} rotation={[-1.571, -0.037, 0.147]} scale={108.24} />
        <mesh geometry={nodes.pillow_square_pillow_square_0.geometry} material={materials.pillow_square} position={[295.63, 59.124, 170.414]} rotation={[-1.231, -0.223, -0.172]} scale={[21.966, 1.895, 21.966]} />
        <mesh geometry={nodes.Quilt_quilt_0.geometry} material={materials.quilt} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.roof_1st_roof_1st_0.geometry} material={materials.roof_1st} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.roof_2nd_roof_2nd_0.geometry} material={materials.roof_2nd} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.skirting_line_skirting_line_0.geometry} material={materials.skirting_line} position={[-387.145, 7.272, -81.731]} rotation={[-Math.PI / 2, 0, 0]} scale={[165.132, 10.981, 17.15]} />
        <mesh geometry={nodes.tea_table_tea_table_0.geometry} material={materials.tea_table} position={[374.964, 35.771, 15.886]} rotation={[-Math.PI / 2, 0, 0]} scale={[54.302, 54.302, 19.096]} />
        <mesh geometry={nodes.tea_table_leg_tea_table_leg_0.geometry} material={materials.tea_table_leg} position={[374.964, 2.14, 15.886]} rotation={[-Math.PI / 2, 0, -2.052]} scale={[44.135, 5.395, 28.767]} />
        <mesh geometry={nodes.TV_TV_0.geometry} material={materials.material} position={[411.889, 143.275, -311.544]} rotation={[-Math.PI / 2, 0, 0]} scale={[97.84, 2.068, 57.396]} />
        <mesh geometry={nodes.wall_wall_0.geometry} material={materials.wall} position={[0, 139.87, -166.923]} rotation={[-Math.PI / 2, 0, 0]} scale={[105.299, 65.834, 140]} />
        <mesh geometry={nodes.wall_dec_wall_dec_0.geometry} material={materials.wall_dec} position={[535.619, 421.03, 264.307]} rotation={[Math.PI, 0, 0]} scale={[106.316, 100, 100]} />
        <mesh geometry={nodes.window_window_0.geometry} material={materials.window} position={[647.687, 4.97, -40.855]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={[-172.162, -4.635, -5.124]}>
            
        </mesh>
      </group>
    </group>
  );
}



// useGLTF.preload 호출을 통해 모델을 미리 로드
useGLTF.preload('/hewroom.glb');



const CameraController = ({ cameraIndex }) => {
  const { camera } = useThree();
  const [position, setPosition] = useState(cameraPositions[0].position);
  const [targetQuaternion, setTargetQuaternion] = useState(new Quaternion());

  useEffect(() => {
    const { position, rotation } = cameraPositions[cameraIndex];
    setPosition(new THREE.Vector3(...position));
    const euler = new Euler(...rotation);
    const quaternion = new Quaternion().setFromEuler(euler);
    setTargetQuaternion(quaternion);
  }, [cameraIndex]);

  useFrame(() => {
    camera.position.lerp(position, 0.05);
    camera.quaternion.slerp(targetQuaternion, 0.05);
  });

  return null;
};



function Room() {
  const [cameraIndex, setCameraIndex] = useState(0);

  // 위치에 해당하는 이름 배열 정의
  const positionNames = ["Living Room", "Kitchen", "Bathroom", "Bedroom", "Top View"];


  return (
    <Suspense fallback={
      <div className="flex justify-center items-center w-full h-screen text-center">
        <div>
          <div className="loader"></div>
          <br />
          
          LIVING HUB 3D View System<br />
        </div>
      </div>
    }>
    <div className="absolute top-0 left-0 w-full h-full z-0">
      <Canvas shadows camera={{ fov: 80, position: [0, 0, 5] }}>
        <color attach="background" args={['#ececec']} />
        <CameraController cameraIndex={cameraIndex} />
        {/* <OrbitControls /> */}
        <Hewroom scale={0.8} rotation-y={-90 * Math.PI / 180} position={[-0.4, -1.5, 0]} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} />
        </EffectComposer>
      </Canvas>
      <div className='absolute top-6 left-6 text-black'>
        <div><img className='w-10 ' src="/images/3dicon.png" alt="" /></div><h2 className='mt-2'>LIVING HUB <br />3D View System</h2>
      </div>
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 space-x-5">
        {cameraPositions.map((_, index) => (
          <button
          key={index}
          className="p-2 px-4 bg-blue-500 text-white rounded shadow-md hover:bg-blue-700 transition-colors duration-150 ease-in-out"
          onClick={() => setCameraIndex(index)}
        >
          {positionNames[index]} {/* 위치 이름으로 버튼 이름 설정 */}
        </button>
        
        ))}
      </div>
    </div>
    </Suspense>
  );
}



export default Room;


// function Room() {
//   const [cameraIndex, setCameraIndex] = useState(0);

//   return (
//     <div className="absolute top-0 left-0 w-full h-full z-0">
//       <Canvas shadows camera={{ fov: 80, position: [0, 0, 5] }}>
//         <color attach="background" args={['#ececec']} />
//         <CameraController cameraIndex={cameraIndex} />
//         <OrbitControls />
//         <Hewroom scale={0.8} rotation-y={-90 * Math.PI / 180} position={[-0.4, -1.5, 0]} />
//         <EffectComposer>
//           <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} />
//         </EffectComposer>
//       </Canvas>
//       <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 space-x-2">
//         {cameraPositions.map((_, index) => (
//           <button
//             key={index}
//             className="p-2 bg-blue-500 text-white rounded"
//             onClick={() => setCameraIndex(index)}
//           >
//             위치 {index + 1}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Room;


// import React from 'react';

// function Room() {
//   return (
//     <div className="flex items-center justify-center" style={{width: '100vw', height: '100vh'}}>
//       <div className="w-4/5 h-4/5 md:w-3/4 md:h-3/4 lg:w-2/3 lg:h-2/3">
//         <iframe
//           src="https://sketchfab.com/models/f3e6f16527af4465858a34cc1e9e7a2b/embed?autostart=1&camera=0&ui_infos=0&ui_controls=0&ui_stop=0"
//           frameBorder="0"
//           allowFullScreen
//           mozallowfullscreen="true"
//           webkitallowfullscreen="true"
//           allow="autoplay; fullscreen; xr-spatial-tracking"
          
          
//           style={{width: '100%', height: '100%'}}
//         ></iframe>
//       </div>
//     </div>
//   );
// }

// export default Room;
