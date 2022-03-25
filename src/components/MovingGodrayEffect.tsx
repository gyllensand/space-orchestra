import { useFrame } from "@react-three/fiber";
import { GodRays } from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { forwardRef, useRef } from "react";
import { MusicNodeData } from "../App";

const Sun = forwardRef<THREE.Mesh, MusicNodeData>(
  ({ analyser, frequency, lightPosition, color }, forwardRef) => {
    useFrame(({ clock }) => {
      // analyser.update();
      const energy = analyser.getEnergy().byFrequency(frequency);
      const scale = analyser._map(energy, -120, -30, 1, 2);
      const intensity = isFinite(scale) && scale > 1 ? scale : 1;

      // @ts-ignore
      if (forwardRef?.current) {
        // // @ts-ignore
        // forwardRef.current.position.x += 0.05;
        // // @ts-ignore
        // forwardRef.current.position.y += 0.05;
        // @ts-ignore
        forwardRef.current.position.x = +Math.sin(clock.getElapsedTime()) * -10;
        // @ts-ignore
        forwardRef.current.position.y = +Math.cos(clock.getElapsedTime()) * -10;
      }

      //@ts-ignore
      if (forwardRef.current) {
        //@ts-ignore
        // forwardRef.current.scale.set(intensity, intensity, intensity);
      }
    });

    return (
      // <mesh ref={forwardRef as any} position={[0, 0, -15]}>
      <mesh ref={forwardRef as any} position={lightPosition}>
        <sphereGeometry args={[1, 36, 36]} />
        <meshBasicMaterial color={color} />
      </mesh>
    );
  }
);

const MovingGodrayEffect = (node: MusicNodeData) => {
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
          decay={0.93}
          weight={0.6}
          exposure={0.4}
          clampMax={1}
          kernelSize={KernelSize.SMALL}
          blur={1}
        />
      )}
    </>
  );
};

export default MovingGodrayEffect;
