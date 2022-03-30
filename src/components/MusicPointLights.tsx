import { useFrame } from "@react-three/fiber";
import { GodRays } from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { Transport, Draw } from "tone";
import { forwardRef, useMemo, useRef } from "react";
import {
  Mesh,
  Vector2,
  PointLightHelper,
  PlaneGeometry,
  MeshBasicMaterial,
  BufferGeometry,
  CubicBezierCurve3,
  Vector3,
} from "three";
import { MusicNodeData } from "../App";

const positions = [
  new Vector3(150, 80, -300),
  new Vector3(-120, 100, -150),
  new Vector3(120, -20, -150),
  new Vector3(-150, 0, -150),
];

const Line = forwardRef<Mesh, MusicNodeData>(
  ({ analyser, frequency, lightPosition, color, player }, forwardRef) => {
    let prevPosition = positions[0];
    let hasRandomized = false;

    useFrame(() => {
      const clamp = (energy: number, threshold: number) =>
        isFinite(energy) && energy > threshold ? energy : threshold;

      const energy = analyser.getEnergy().byFrequency(frequency);
      const lightEnergy = analyser._map(energy, -100, -80, 0, 1);
      const lightValue = clamp(lightEnergy, 0);

      if (lightValue === 0 && !hasRandomized) {
        hasRandomized = true;
        console.log("övre");
        // @ts-ignore
        forwardRef.current!.position.set(
          // Math.random() * 300 - 150,
          // Math.random() * 300 - 150,
          Math.ceil(Math.random() * 120) * (Math.round(Math.random()) ? 1 : -1),
          Math.ceil(Math.random() * 120) * (Math.round(Math.random()) ? 1 : -1),
          -150
        );
      } else if (lightValue > 0 && hasRandomized) {
        console.log("undre");
        hasRandomized = false;
      }

      // @ts-ignore
      // forwardRef.current!.scale.set(lightValue, lightValue, lightValue);

      if (player.state === "started") {
        // @ts-ignore
        forwardRef.current!.scale.set(lightValue, lightValue, lightValue);
      } else {
        // @ts-ignore
        forwardRef.current!.scale.set(0, 0, 0);
      }
    });

    const geometry = new PlaneGeometry(20, 3, 20, 20);
    const material = new MeshBasicMaterial({ color });

    return (
      <mesh
        ref={forwardRef as any}
        position={positions[0]}
        geometry={geometry}
        material={material}
        receiveShadow={false}
      />
    );
  }
);

const LightningLight = (node: MusicNodeData) => {
  const lineRef = useRef<THREE.Mesh>();

  return (
    <>
      <Line ref={lineRef as any} {...node} />

      {lineRef.current && (
        <GodRays
          sun={lineRef.current}
          blendFunction={BlendFunction.ALPHA}
          samples={30}
          density={0.97}
          decay={0.9}
          weight={0.5}
          exposure={0.3}
          clampMax={1}
          kernelSize={KernelSize.VERY_SMALL}
          blur={1}
        />
      )}
    </>
  );
};

export default LightningLight;
