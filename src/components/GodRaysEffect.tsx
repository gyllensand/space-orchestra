import { useFrame } from "@react-three/fiber";
import { GodRays } from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { forwardRef, useRef } from "react";
import { MusicNode } from "../App";

const Sun = forwardRef<THREE.Mesh, MusicNode>(
  ({ analyser, frequency, lightPosition, color }, forwardRef) => {
    useFrame(() => {
      const energy = analyser.getEnergy().byFrequency(frequency);
      const scale = analyser._map(energy, -120, -30, 0, 3);
      const intensity = isFinite(scale) && scale > 0 ? scale : 0;

      //@ts-ignore
      if (forwardRef.current) {
        //@ts-ignore
        forwardRef.current.scale.set(intensity, intensity, intensity);
      }
    });

    return (
      <mesh ref={forwardRef as any} position={lightPosition}>
        <sphereGeometry args={[1, 36, 36]} />
        <meshBasicMaterial color={color} />
      </mesh>
    );
  }
);

const GodRaysEffect = (node: MusicNode) => {
  const sunRef = useRef<THREE.Mesh>();

  return (
    <>
      <Sun ref={sunRef as any} {...node} />
      {sunRef.current && (
          <GodRays
            sun={sunRef.current}
            blendFunction={BlendFunction.SCREEN}
            samples={30}
            density={0.97}
            decay={0.96}
            weight={0.2}
            exposure={0.4}
            clampMax={1}
            kernelSize={KernelSize.SMALL}
            blur={1}
          />
      )}
    </>
  );
};

export default GodRaysEffect;
