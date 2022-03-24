import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { animated } from "@react-spring/three";
import { Mesh } from "three";
import { COLORS, MusicNode } from "../App";
import { GodRays } from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { useCubeTexture, MeshWobbleMaterial } from "@react-three/drei";

interface ElementProps extends MusicNode {
  onClick: () => void;
}

const MusicElement = ({
  position,
  size,
  onClick,
  isActive,
  analyser,
  frequency,
}: ElementProps) => {
  const outlineMesh = useRef<Mesh>();
  const plateMesh = useRef<Mesh>();
  const outlineMaterial = useRef<Mesh>();
  const hiddenPlateMesh = useRef<Mesh>();
  const [hovered, setHover] = useState(false);

  useFrame(() => {
    const energy = analyser.getEnergy().byFrequency(frequency);
    const outerScale = analyser._map(energy, -300, -30, 1, 1.5);
    const outerSize = isFinite(outerScale) && outerScale > 1 ? outerScale : 1;
    const innerScale = analyser._map(energy, -100, -30, 1, 3);
    const innerSize = isFinite(innerScale) && innerScale > 1 ? innerScale : 1;
    const wobbleScale = analyser._map(energy, -100, -30, 0, 1);
    const wobbleSize =
      isFinite(wobbleScale) && wobbleScale > 0 ? wobbleScale : 0;

    if (isActive) {
      outlineMesh.current!.scale.set(outerSize, outerSize, outerSize);
      //@ts-ignore
      outlineMaterial.current.factor = wobbleSize;
      hiddenPlateMesh.current!.scale.set(outerSize, outerSize, outerSize);
      plateMesh.current!.scale.set(innerSize, innerSize, innerSize);
    } else {
      outlineMesh.current!.scale.set(1, 1, 1);
    }
  });

  const envMap = useCubeTexture(
    ["xx.jpeg", "xx.jpeg", "xx.jpeg", "xx.jpeg", "xx.jpeg", "xx.jpeg"],
    { path: `${process.env.PUBLIC_URL}/reflectionTexture/` }
  );

  return (
    <>
      <group
        onClick={(event) => onClick()}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}
      >
        <mesh ref={hiddenPlateMesh} position={position}>
          <circleGeometry args={[1, 32]} />
          <meshBasicMaterial visible={false} />
        </mesh>
        <mesh ref={plateMesh} position={position}>
          <ringGeometry args={[0.05, 0.2, 32]} />
          <meshBasicMaterial envMap={envMap} color={COLORS.gold} />
        </mesh>
        <animated.mesh ref={outlineMesh} position={position}>
          <torusGeometry args={size} />

          <MeshWobbleMaterial
            ref={outlineMaterial}
            attach="material"
            color={hovered ? COLORS.orange : COLORS.gold}
            factor={0}
            speed={2}
            roughness={0}
          />
        </animated.mesh>
      </group>

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

export default MusicElement;
