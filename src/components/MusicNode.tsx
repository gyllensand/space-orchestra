import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh, PointLight } from "three";
import { COLORS, MusicNodeData } from "../App";
import { GodRays } from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { useCubeTexture, MeshWobbleMaterial } from "@react-three/drei";

const MusicNode = ({
  position,
  player,
  size,
  onClick,
  analyser,
  frequency,
  isActive,
}: MusicNodeData & { onClick: () => void; isActive: boolean }) => {
  const outlineMesh = useRef<Mesh>();
  const plateMesh = useRef<Mesh>();
  const outlineMaterial = useRef<Mesh>();
  const hitboxMesh = useRef<Mesh>();
  const light = useRef<PointLight>();

  useFrame(({ clock }) => {
    analyser.update();

    const clamp = (energy: number, threshold: number) =>
      isFinite(energy) && energy > threshold ? energy : threshold;

    const energy = analyser.getEnergy().byFrequency(frequency);

    const outerEnergy = analyser._map(energy, -150, -30, 1, 1.5);
    const outerValue = clamp(outerEnergy, 1);

    const innerEnergy = analyser._map(energy, -100, -30, 1, 3);
    const innerValue = clamp(innerEnergy, 1);

    const wobbleEnergy = analyser._map(energy, -100, -30, 0, 1);
    const wobbleValue = clamp(wobbleEnergy, 0);

    const lightEnergy = analyser._map(energy, -100, -30, 0, 3);
    const lightValue = clamp(lightEnergy, 0);

    //@ts-ignore
    outlineMaterial.current.factor = wobbleValue;
    outlineMesh.current!.scale.set(outerValue, outerValue, outerValue);
    hitboxMesh.current!.scale.set(outerValue, outerValue, outerValue);
    plateMesh.current!.scale.set(innerValue, innerValue, innerValue);
    light.current!.intensity = lightValue;
  });

  const envMap = useCubeTexture(
    ["xx.jpeg", "xx.jpeg", "xx.jpeg", "xx.jpeg", "xx.jpeg", "xx.jpeg"],
    { path: `${process.env.PUBLIC_URL}/reflectionTexture/` }
  );

  return (
    <>
      <mesh ref={hitboxMesh} position={position} onClick={() => onClick()}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      <mesh ref={plateMesh} position={position}>
        <ringGeometry args={[0.05, 0.2, 32]} />
        <meshBasicMaterial
          envMap={envMap}
          color={isActive ? COLORS.green : COLORS.gold}
        />
      </mesh>
      <mesh ref={outlineMesh} position={position}>
        <torusGeometry args={size} />

        <MeshWobbleMaterial
          ref={outlineMaterial}
          attach="material"
          color={COLORS.gold}
          factor={0}
          speed={2}
          roughness={0}
        />
      </mesh>
      <pointLight
        ref={light}
        distance={3}
        intensity={0}
        position={position}
        color={COLORS.gold}
      />

      {outlineMesh.current && plateMesh.current && (
        <GodRays
          sun={plateMesh.current}
          blendFunction={BlendFunction.SCREEN}
          samples={30}
          density={0.97}
          decay={0.9}
          weight={0.2}
          exposure={0.2}
          clampMax={1}
          kernelSize={KernelSize.SMALL}
          blur={1}
        />
      )}
    </>
  );
};

export default MusicNode;
