import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { MusicNodeData } from "../App";

const MusicPointLights = (node: MusicNodeData) => {
  const light = useRef<THREE.PointLight>();

  useFrame(() => {
    node.analyser.update();
    const energy = node.analyser.getEnergy().byFrequency(node.frequency);
    const scale = node.analyser._map(energy, -90, -30, 1, 300);
    const intensity = isFinite(scale) && scale > 1 ? scale : 1;

    if (light.current) {
      light.current.intensity = intensity;
    }
  });

  return (
    <pointLight
      ref={light}
      distance={20}
      intensity={40}
      position={node.lightPosition}
      color={node.color}
    />
  );
};

export default MusicPointLights;
