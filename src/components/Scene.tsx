import { useCallback, useState } from "react";
import { useThree } from "@react-three/fiber";
import { CameraShake, OrbitControls } from "@react-three/drei";
import { EffectComposer } from "@react-three/postprocessing";
import { Transport, start } from "tone";
import MusicNode from "./MusicNode";
import Swarm from "./Swarm";
import MusicPointLights from "./SwarmPointLight";
import GodRaysEffect from "./GodRaysEffect";
import { DEFAULT_FADE, musicNodes } from "../App";

const Scene = () => {
  const { scene, camera } = useThree();
  const [hasBeenInteractedWith, setHasBeenInteractedWith] = useState(false);

  Transport.bpm.value = 108;
  Transport.loop = true;
  Transport.loopStart = "4m";
  Transport.loopEnd = "8m";

  const initializeTone = useCallback(async () => {
    await start();
    setHasBeenInteractedWith(true);
  }, []);

  const onMusicNodeClick = useCallback(
    async (index: number) => {
      if (!hasBeenInteractedWith) {
        initializeTone();
      }

      if (Transport.state === "stopped") {
        Transport.start();
      }

      const { player, startTime, startOffset } = musicNodes[index];

      if (player.state === "stopped") {
        player.sync().start(startTime, startOffset);
      } else {
        player.stop();
        setTimeout(() => player.unsync(), 500);

        const activeNodes = musicNodes.find(
          (node) => node.player.state === "started"
        );

        if (!activeNodes) {
          console.log("no");
          musicNodes.forEach((node) => (node.player.fadeIn = 0));
          Transport.stop();
        } else {
          console.log("yes");
          musicNodes.forEach((node) => (node.player.fadeIn = DEFAULT_FADE));
        }
      }
    },
    [initializeTone, hasBeenInteractedWith]
  );

  return (
    <>
      <color attach="background" args={[0, 0, 0]} />
      <pointLight position={[10, 5, 10]} distance={50} intensity={0.5} />
      <OrbitControls />
      <Swarm count={5000} />

      {musicNodes.map((o, i) => (
        <MusicPointLights key={i} {...o} />
      ))}
      <CameraShake
        yawFrequency={0.2}
        pitchFrequency={0.2}
        rollFrequency={0.2}
      />
      <EffectComposer>
        <>
          {musicNodes.map((o, i) => (
            <MusicNode key={i} {...o} onClick={() => onMusicNodeClick(i)} />
          ))}
          {musicNodes.map((o, i) => (
            <GodRaysEffect key={i} {...o} />
          ))}
        </>
      </EffectComposer>
    </>
  );
};

export default Scene;
