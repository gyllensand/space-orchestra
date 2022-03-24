import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useThree, Vector3 } from "@react-three/fiber";
import { CameraShake, OrbitControls, ShakeController } from "@react-three/drei";
import { Unit, Player, Transport, start, getTransport } from "tone";
import AudioEnergy, { FrequencyNames } from "./AudioEnergy";
import MusicElement from "./components/MusicElement";
import Swarm from "./components/Swarm";
import MusicPointLights from "./components/SwarmPointLight";
import GodRaysEffect from "./components/GodRaysEffect";
import { EffectComposer } from "@react-three/postprocessing";
import MovingGodrayEffect from "./components/MovingGodrayEffect";

export const COLORS = {
  gold: "#ebb134",
  purple: "#e731ce",
  green: "#30f8a0",
  red: "#eb3434",
  orange: "#fe7418",
};

export interface MusicNode {
  position: Vector3;
  player: Player;
  analyser: AudioEnergy;
  startTime: Unit.Time;
  startOffset?: Unit.Time;
  frequency: FrequencyNames;
  color: string;
  lightPosition: [number, number, number];
  size: [number, number, number, number];
  isActive?: boolean;
}

const data: MusicNode[] = [
  {
    position: [-1.5, 1, -2],
    size: [0.9, 0.1, 30, 200],
    startTime: 0,
    frequency: "bass",
    lightPosition: [0, 30, -50],
    color: COLORS.purple,
    analyser: new AudioEnergy(),
    player: new Player({
      url: "https://tonejs.github.io/audio/loop/kick.mp3",
      loop: true,
    }),
  },
  {
    position: [1.5, 1, -2],
    size: [0.9, 0.1, 30, 200],
    startTime: "2n",
    frequency: "mid",
    lightPosition: [-30, -10, -50],
    color: COLORS.green,
    analyser: new AudioEnergy(),
    player: new Player({
      url: "https://tonejs.github.io/audio/loop/snare.mp3",
      loop: true,
    }),
  },
  {
    position: [0, -1.5, -2],
    size: [0.9, 0.1, 30, 200],
    startTime: "3:3",
    startOffset: "4n",
    frequency: "treble",
    lightPosition: [30, -20, -50],
    color: COLORS.gold,
    analyser: new AudioEnergy(),
    player: new Player({
      url: "https://tonejs.github.io/audio/loop/hh.mp3",
      loop: true,
    }),
  },
];

const CanvasView = () => {
  const { scene, camera } = useThree();
  const cameraShakeRef = useRef<ShakeController>();
  const [hasBeenInteractedWith, setHasBeenInteractedWith] = useState(false);
  const [musicNodes, setMusicNodes] = useState<MusicNode[]>(
    data.map((o) => ({ ...o, isActive: false }))
  );
  console.log(getTransport());
  const prevMusicNodesRef = useRef<MusicNode[]>();
  useEffect(() => {
    prevMusicNodesRef.current = musicNodes;
  });
  const prevMusicNodes = prevMusicNodesRef.current;

  Transport.bpm.value = 108;
  Transport.loop = true;
  Transport.loopStart = "4m";
  Transport.loopEnd = "8m";

  useEffect(() => {
    if (prevMusicNodes) {
      return;
    }
    console.log("123");
    musicNodes.forEach(({ player, analyser }) => {
      player.toDestination().sync();
      player.connect(analyser);
    });
  }, [musicNodes, prevMusicNodes]);

  useEffect(() => {
    if (!hasBeenInteractedWith) {
      return;
    }
    console.log("yaap");
    const activeNodes = musicNodes.filter(
      (node, i) =>
        node.isActive && prevMusicNodes && !prevMusicNodes[i].isActive
    );

    const inactiveNodes = musicNodes.filter(
      (node, i) =>
        !node.isActive && prevMusicNodes && prevMusicNodes[i].isActive
    );

    activeNodes.forEach(({ player, startTime, startOffset }) => {
      // if (prevMusicNodes) {
      //   player.volume.value = 1;
      // } else {
      //   player.start(startTime, startOffset);
      // }
      player.start(startTime, startOffset);
    });

    inactiveNodes.forEach(({ player }) => {
      // player.volume.value = 0;
      player.stop();
    });
  }, [musicNodes, prevMusicNodes, hasBeenInteractedWith]);

  const onMusicNodeClick = useCallback(
    async (index: number) => {
      if (!hasBeenInteractedWith) {
        console.log("before start");
        await start();
        console.log("after start");
        Transport.start();
        setHasBeenInteractedWith(true);
      }

      const updatedNodes = musicNodes.map((o, i) => {
        if (i !== index) {
          return o;
        }

        return {
          ...o,
          isActive: !o.isActive,
        };
      });

      setMusicNodes(updatedNodes);
    },
    [musicNodes, hasBeenInteractedWith]
  );

  setInterval(() => {
    const progress = (Transport.progress + 1) / 2;
    console.log(progress);
  }, 16);

  return (
    <>
      <color attach="background" args={[0, 0, 0]} />
      {/* <fog attach="fog" args={["#ffffff", 20, 80]} /> */}

      {/* <ambientLight intensity={0.05} /> */}
      {/* <gridHelper /> */}
      <pointLight position={[10, 5, 10]} distance={50} intensity={0.5} />
      {/* <OrbitControls /> */}
      <Swarm count={5000} />

      {musicNodes.map((o, i) => (
        <MusicPointLights key={i} {...o} />
      ))}
      <CameraShake
        ref={cameraShakeRef}
        yawFrequency={0.2}
        pitchFrequency={0.2}
        rollFrequency={0.2}
      />
      <EffectComposer>
        <>
          {musicNodes.map((o, i) => (
            <MusicElement key={i} {...o} onClick={() => onMusicNodeClick(i)} />
          ))}
          {musicNodes.map((o, i) => (
            <GodRaysEffect key={i} {...o} />
          ))}
        </>
      </EffectComposer>
    </>
  );
};

const App = () => (
  <Canvas style={{ flex: 1 }}>
    <Suspense fallback={null}>
      <CanvasView />
    </Suspense>
  </Canvas>
);

export default App;
