import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { MusicNodeData } from "../App";

const SwarmPointLight = (node: MusicNodeData) => {
  const light = useRef<THREE.PointLight>();

  useFrame(() => {
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
      intensity={1000}
      position={node.lightPosition}
      color={node.color}
    />
  );
};

export default SwarmPointLight;
