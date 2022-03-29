import { useCallback, useState } from "react";
import { useThree } from "@react-three/fiber";
import { CameraShake, OrbitControls } from "@react-three/drei";
import { EffectComposer } from "@react-three/postprocessing";
import { Transport, start } from "tone";
import MusicNode from "./MusicNode";
import Swarm from "./Swarm";
import SwarmPointLight from "./SwarmPointLight";
import GodRaysEffect from "./GodRaysEffect";
import { DEFAULT_FADE, musicNodes, secondaryMusicNodeData } from "../App";
import MovingGodrayEffect from "./MovingGodrayEffect";
import LightningLight from "./LightningLight";

const Scene = () => {
  const { scene, camera } = useThree();
  const [hasBeenInteractedWith, setHasBeenInteractedWith] = useState(false);
  const [activeNodes, setActiveNodes] = useState<boolean[]>(
    musicNodes.map(() => false)
  );

  Transport.bpm.value = 110;
  Transport.loop = true;
  Transport.loopStart = 0;
  Transport.loopEnd = "32m";

  // Transport.bpm.value = 110;
  // Transport.loop = true;
  // Transport.loopStart = "4m";
  // Transport.loopEnd = "8m";

  const initializeTone = useCallback(async () => {
    await start();
    setHasBeenInteractedWith(true);
  }, []);

  const onMusicNodeClick = useCallback(
    async (index: number) => {
      if (!hasBeenInteractedWith) {
        await initializeTone();
      }

      if (Transport.state === "stopped") {
        Transport.start();
      }

      const { players, supportivePlayers, startTime, startOffset } =
        musicNodes[index];

      const inActivePlayers = players.filter(
        (player) => player.state === "stopped"
      );

      const activePlayers = activeNodes.map((o, i) => (i === index ? !o : o));

      if (players[0].state === "stopped") {
        setActiveNodes(activePlayers);
        inActivePlayers[0].sync().start(startTime, startOffset);
        supportivePlayers?.forEach((player) =>
          player.sync().start(startTime, startOffset)
        );
      } else if (inActivePlayers.length > 0) {
        inActivePlayers[0].sync().start(startTime, startOffset);
      } else {
        setActiveNodes(activePlayers);
        players.forEach((player) => player.stop().unsync());
        supportivePlayers?.forEach((player) => player.stop().unsync());

        // setTimeout(() => {
        //   players.forEach((player) => player.unsync());
        //   supportivePlayers?.forEach((player) => player.unsync());
        // }, 500);

        const activeNodes = musicNodes.find(
          (node) => node.players[0].state === "started"
        );

        if (!activeNodes) {
          // musicNodes.forEach((node) => (node.players[0].fadeIn = 0));
          Transport.stop();
        } else {
          // musicNodes.forEach((node) => (node.players[0].fadeIn = DEFAULT_FADE));
        }
      }

      if (
        secondaryMusicNodeData[0].player.state === "stopped" &&
        [musicNodes[0], musicNodes[1], musicNodes[2]].every(
          (node) => node.players[0].state === "started"
        )
      ) {
        secondaryMusicNodeData[0].player
          .toDestination()
          .sync()
          .start(startTime, startOffset);
      } else if (
        secondaryMusicNodeData[0].player.state === "started" &&
        ![musicNodes[0], musicNodes[1], musicNodes[2]].every(
          (node) => node.players[0].state === "started"
        )
      ) {
        secondaryMusicNodeData[0].player.stop().unsync();
        // setTimeout(() => secondaryMusicNodeData[0].player.unsync(), 500);
      }
    },
    [initializeTone, hasBeenInteractedWith, activeNodes]
  );

  return (
    <>
      <color attach="background" args={[0, 0, 0]} />
      <pointLight position={[10, 5, 10]} distance={50} intensity={0.5} />
      <OrbitControls />

      {/* <LightningLight {...musicNodes[4]} /> */}

      <Swarm count={5000} />
      {musicNodes.map((o, i) => i < 3 && <SwarmPointLight key={i} {...o} />)}

      <CameraShake
        yawFrequency={0.2}
        pitchFrequency={0.2}
        rollFrequency={0.2}
      />
      <EffectComposer>
        <>
          {musicNodes.map((o, i) => (
            <MusicNode
              key={i}
              {...o}
              onClick={() => onMusicNodeClick(i)}
              isActive={activeNodes[i]}
            />
          ))}
          {musicNodes.map((o, i) => i < 3 && <GodRaysEffect key={i} {...o} />)}
          {/* <MovingGodrayEffect {...musicNodes[4]} /> */}
        </>
      </EffectComposer>
    </>
  );
};

export default Scene;
