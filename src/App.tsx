import { Suspense } from "react";
import { Canvas, Vector3 } from "@react-three/fiber";
import { Unit, Player } from "tone";
import AudioEnergy, { FrequencyNames } from "./AudioEnergy";
import Scene from "./components/Scene";

export const DEFAULT_FADE = "0.5s";

export const COLORS = {
  gold: "#ebb134",
  purple: "#e731ce",
  green: "#30f8a0",
  red: "#eb3434",
  orange: "#fe7418",
};

export interface MusicNodeData {
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

export const musicNodes: MusicNodeData[] = [
  {
    position: [-1.5, 1, -2],
    size: [0.9, 0.1, 30, 200],
    startTime: 0,
    frequency: "lowMid",
    lightPosition: [0, 30, -50],
    color: COLORS.purple,
    analyser: new AudioEnergy(),
    player: new Player({
      url: "https://tonejs.github.io/audio/loop/kick.mp3",
      // url: `${process.env.PUBLIC_URL}/audio/drums2.mp3`,
      loop: true,
      fadeIn: 0,
      fadeOut: DEFAULT_FADE,
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
      fadeIn: 0,
      fadeOut: DEFAULT_FADE,
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
      fadeIn: 0,
      fadeOut: DEFAULT_FADE,
    }),
  },
];

const App = () => (
  <Canvas style={{ flex: 1 }}>
    <Suspense fallback={null}>
      <Scene />
    </Suspense>
  </Canvas>
);

export default App;
