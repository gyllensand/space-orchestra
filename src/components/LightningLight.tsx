import { useFrame } from "@react-three/fiber";
import { GodRays } from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { forwardRef, useRef } from "react";
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

const planeCurve = (g: PlaneGeometry, z: number) => {
  let p = g.parameters;
  let hw = p.width * 0.5;

  let a = new Vector2(-hw, 0);
  let b = new Vector2(0, z);
  let c = new Vector2(hw, 0);

  let ab = new Vector2().subVectors(a, b);
  let bc = new Vector2().subVectors(b, c);
  let ac = new Vector2().subVectors(a, c);

  let r =
    (ab.length() * bc.length() * ac.length()) / (2 * Math.abs(ab.cross(ac)));

  let center = new Vector2(0, z - r);
  let baseV = new Vector2().subVectors(a, center);
  let baseAngle = baseV.angle() - Math.PI * 0.5;
  let arc = baseAngle * 2;

  let uv = g.attributes.uv;
  let pos = g.attributes.position;
  let mainV = new Vector2();
  for (let i = 0; i < uv.count; i++) {
    let uvRatio = 1 - uv.getX(i);
    let y = pos.getY(i);
    mainV.copy(c).rotateAround(center, arc * uvRatio);
    pos.setXYZ(i, mainV.x, y, -mainV.y);
  }

  pos.needsUpdate = true;
};

const Line = forwardRef<Mesh, MusicNodeData>(
  ({ analyser, frequency, lightPosition, color, player }, forwardRef) => {
    useFrame(() => {
      const clamp = (energy: number, threshold: number) =>
        isFinite(energy) && energy > threshold ? energy : threshold;

      const energy = analyser.getEnergy().byFrequency(frequency);
      const lightEnergy = analyser._map(energy, -150, -100, 0, 1);
      const lightValue = clamp(lightEnergy, 0);

      // @ts-ignore
      // forwardRef.current!.scale.set(lightValue, lightValue, lightValue);

      // if (player.state === "started") {
      //   // @ts-ignore
      //   forwardRef.current!.scale.set(1, lightValue, 1);
      // } else {
      //   // @ts-ignore
      //   forwardRef.current!.scale.set(0, 0, 0);
      // }
    });

    // const geometry = new PlaneGeometry(500, 1, 20, 20);
    // const geometry = new PlaneGeometry(500, 20, 20, 20);
    // planeCurve(geometry, 20);

    // const material = new MeshBasicMaterial({ color });

    // return (
    //   <mesh
    //     ref={forwardRef as any}
    //     position={lightPosition}
    //     geometry={geometry}
    //     material={material}
    //     receiveShadow={false}
    //   />
    // );

    const curve = new CubicBezierCurve3(
      new Vector3(10, -5, 0),
      new Vector3(10, -2, 0),
      new Vector3(-10, -2, 0),
      new Vector3(-10, -5, 0)
    );

    const points = curve.getPoints(50);
    const geometry = new BufferGeometry().setFromPoints(points);

    return (
      // @ts-ignore
      <line geometry={geometry} ref={forwardRef as any}>
        <lineBasicMaterial color={color} linewidth={10} />
      </line>
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
          blendFunction={BlendFunction.SCREEN}
          samples={30}
          density={0.97}
          decay={0.8}
          weight={0.3}
          exposure={0.3}
          clampMax={1}
          kernelSize={KernelSize.SMALL}
          blur={1}
        />
      )}
    </>
  );
};

export default LightningLight;
