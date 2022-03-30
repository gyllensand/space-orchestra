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
  blue: "#497fff",
};

export interface MusicNodeData {
  position: Vector3;
  player: Player;
  supportivePlayer?: Player;
  analyser: AudioEnergy;
  frequency: FrequencyNames;
  color: string;
  lightPosition: Vector3;
  size: [number, number, number, number];
}

export const musicNodes: MusicNodeData[] = [
  {
    position: [-1.5, 1, -2],
    size: [0.9, 0.1, 30, 200],
    frequency: "lowMid",
    lightPosition: [0, 30, -50],
    color: COLORS.purple,
    analyser: new AudioEnergy(),
    player: new Player({
      url: `${process.env.PUBLIC_URL}/audio/kick.mp3`,
      fadeIn: 0,
    }),
  },
  {
    position: [1.5, 1, -2],
    size: [0.9, 0.1, 30, 200],
    frequency: "highMid",
    lightPosition: [-30, -10, -50],
    color: COLORS.green,
    analyser: new AudioEnergy(),
    player: new Player({
      url: `${process.env.PUBLIC_URL}/audio/clap.mp3`,
      fadeIn: 0,
    }),
  },
  {
    position: [0, -1.5, -2],
    size: [0.9, 0.1, 30, 200],
    frequency: "treble",
    lightPosition: [30, -20, -50],
    color: COLORS.gold,
    analyser: new AudioEnergy(),
    player: new Player({
      url: `${process.env.PUBLIC_URL}/audio/sticks.mp3`,
      fadeIn: 0,
    }),
  },
  {
    position: [-2.5, -1.25, -5],
    size: [0.7, 0.08, 30, 200],
    frequency: "mid",
    lightPosition: [30, -20, -50],
    color: COLORS.blue,
    analyser: new AudioEnergy(),
    player: new Player({
      url: `${process.env.PUBLIC_URL}/audio/pluck.mp3`,
      fadeIn: 0,
    }),

    supportivePlayer: new Player({
      url: `${process.env.PUBLIC_URL}/audio/pluck1.mp3`,
      fadeIn: 0,
    }),
  },
  {
    position: [2.5, -1.25, -5],
    size: [0.7, 0.08, 30, 200],
    frequency: "mid",
    // lightPosition: [0, -120, -150],
    // lightPosition: [0, 0, 5],
    lightPosition: [0, -120, -150],
    color: COLORS.blue,
    analyser: new AudioEnergy(),
    player: new Player({
      url: `${process.env.PUBLIC_URL}/audio/pad.mp3`,
      fadeIn: 0,
    }),
  },
];

export interface SecondaryMusicNodeData {
  player: Player;
  analyser: AudioEnergy;
}

export const secondaryMusicNodes: SecondaryMusicNodeData[] = [
  {
    analyser: new AudioEnergy(),
    player: new Player({
      url: `${process.env.PUBLIC_URL}/audio/highs.mp3`,
      fadeIn: 0,
    }),
  },
  {
    analyser: new AudioEnergy(),
    player: new Player({
      url: `${process.env.PUBLIC_URL}/audio/pluck2.mp3`,
      fadeIn: 0,
    }),
  },
  {
    analyser: new AudioEnergy(),
    player: new Player({
      url: `${process.env.PUBLIC_URL}/audio/bass.mp3`,
      fadeIn: 0,
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
