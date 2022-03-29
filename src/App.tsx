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
  blue: "#062d89",
};

export interface MusicNodeData {
  position: Vector3;
  players: Player[];
  supportivePlayers?: Player[];
  analyser: AudioEnergy;
  startTime: Unit.Time;
  startOffset?: Unit.Time;
  frequency: FrequencyNames;
  color: string;
  lightPosition: [number, number, number];
  size: [number, number, number, number];
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
    players: [
      new Player({
        url: `${process.env.PUBLIC_URL}/audio/kick.mp3`,
        fadeIn: 0,
        // fadeOut: DEFAULT_FADE,
      }),
    ],
  },
  {
    position: [1.5, 1, -2],
    size: [0.9, 0.1, 30, 200],
    startTime: 0,
    frequency: "highMid",
    lightPosition: [-30, -10, -50],
    color: COLORS.green,
    analyser: new AudioEnergy(),
    players: [
      new Player({
        url: `${process.env.PUBLIC_URL}/audio/clap.mp3`,
        fadeIn: 0,
        // fadeOut: DEFAULT_FADE,
      }),
    ],
  },
  {
    position: [0, -1.5, -2],
    size: [0.9, 0.1, 30, 200],
    startTime: 0,
    frequency: "treble",
    lightPosition: [30, -20, -50],
    color: COLORS.gold,
    analyser: new AudioEnergy(),
    players: [
      new Player({
        url: `${process.env.PUBLIC_URL}/audio/sticks.mp3`,
        fadeIn: 0,
        // fadeOut: DEFAULT_FADE,
      }),
    ],
  },
  {
    position: [-2.5, -1.25, -5],
    size: [0.7, 0.08, 30, 200],
    startTime: 0,
    frequency: "mid",
    lightPosition: [30, -20, -50],
    color: COLORS.gold,
    analyser: new AudioEnergy(),
    players: [
      new Player({
        url: `${process.env.PUBLIC_URL}/audio/pluck.mp3`,
        fadeIn: 0,
        // fadeOut: DEFAULT_FADE,
      }),
    ],
    supportivePlayers: [
      new Player({
        url: `${process.env.PUBLIC_URL}/audio/pluck1.mp3`,
        fadeIn: 0,
        // fadeOut: DEFAULT_FADE,
      }),
    ],
  },
  {
    position: [2.5, -1.25, -5],
    size: [0.7, 0.08, 30, 200],
    startTime: 0,
    frequency: "mid",
    lightPosition: [0, 0, -100],
    color: COLORS.blue,
    analyser: new AudioEnergy(),
    players: [
      new Player({
        url: `${process.env.PUBLIC_URL}/audio/pad.mp3`,
        fadeIn: 0,
        // fadeOut: DEFAULT_FADE,
      }),
    ],
  },
];

export interface SecondaryMusicNodeData {
  player: Player;
  analyser: AudioEnergy;
}

export const secondaryMusicNodeData: SecondaryMusicNodeData[] = [
  {
    analyser: new AudioEnergy(),
    player: new Player({
      url: `${process.env.PUBLIC_URL}/audio/highs.mp3`,
      fadeIn: 0,
      // fadeOut: DEFAULT_FADE,
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
