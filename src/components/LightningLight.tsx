import { useHelper } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import {
  Mesh,
  MeshLambertMaterial,
  PlaneBufferGeometry,
  PointLight,
  PointLightHelper,
  TextureLoader,
} from "three";
import { MusicNodeData } from "../App";

const LightningLight = (node: MusicNodeData) => {
  const { scene } = useThree();
  const light = useRef<PointLight>();
  let cloudParticles: Mesh[] = [];

  // Smoke Texture Loader
  let loader = new TextureLoader();
  // loader.load(
  //   "https://raw.githubusercontent.com/navin-navi/codepen-assets/master/images/smoke.png",
  //   function (texture) {
  //     const cloudGeo = new PlaneBufferGeometry(200, 200);
  //     const cloudMaterial = new MeshLambertMaterial({
  //       map: texture,
  //       transparent: true,
  //     });

  //     for (let p = 0; p < 5; p++) {
  //       let cloud = new Mesh(cloudGeo, cloudMaterial);
  //       cloud.position.set(Math.random() * 200 - 100, 50, -(p * 50 + 50));
  //       // cloud.position.set(
  //       //   Math.random() * (-50 + 0) - 0,
  //       //   0,
  //       //   Math.random() * (-150 + 100) - 100
  //       // );
  //       cloud.rotation.x = 1.16;
  //       // cloud.rotation.y = -0.12;
  //       // cloud.rotation.z = Math.random() * 2 * Math.PI;
  //       cloud.material.opacity = 0.55;
  //       cloudParticles.push(cloud);
  //       scene.add(cloud);
  //     }
  //   }
  // );

  // useFrame(() => {
  //   const energy = node.analyser.getEnergy().byFrequency(node.frequency);
  //   const scale = node.analyser._map(energy, -90, -30, 1, 300);
  //   const intensity = isFinite(scale) && scale > 1 ? scale : 1;

  //   if (Math.random() > 0.96 || light.current!.intensity > 100) {
  //     if (light.current!.intensity < 100) {
  //       // light.current!.position.set(0, 20, -200);
  //       light.current!.position.set(
  //         Math.random() * 200 - 100,
  //         Math.random() * 60 - 40,
  //         -100
  //       );
  //     }
  //     light.current!.intensity = 1 + Math.random() * 10;
  //   }

  //   cloudParticles.forEach((p) => {
  //     p.rotation.z -= 0.002;
  //   });

  //   // if (light.current) {
  //   //   light.current.intensity = intensity;
  //   // }
  // });

  useHelper(light, PointLightHelper, 10);

  return (
    <>
      {/* <mesh position={[0, -500, -1200]}>
        <sphereBufferGeometry args={[1000, 32, 32]} />
        <meshStandardMaterial attach="material" color="red" />
      </mesh> */}
      <ambientLight />
      <pointLight
        ref={light}
        distance={50}
        intensity={50}
        decay={1.5}
        position={[0, 20, -150]}
        color={node.color}
      />
    </>
  );
};

export default LightningLight;
