import { useCallback, useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { CameraShake, OrbitControls } from "@react-three/drei";
import { EffectComposer } from "@react-three/postprocessing";
import { Transport, start, Draw } from "tone";
import MusicNode from "./MusicNode";
import Swarm from "./Swarm";
import SwarmPointLight from "./SwarmPointLight";
import GodRaysEffect from "./GodRaysEffect";
import { DEFAULT_FADE, musicNodes, secondaryMusicNodes } from "../App";
import MovingGodrayEffect from "./MovingGodrayEffect";
import LightningLight from "./LightningLight";
import MusicPointsLights from "./MusicPointLights";

const Scene = () => {
  const { scene, camera } = useThree();
  const [hasBeenInteractedWith, setHasBeenInteractedWith] = useState(false);
  const [activeNodes, setActiveNodes] = useState<boolean[]>(
    musicNodes.map(() => false)
  );

  Transport.timeSignature = [4, 4];
  Transport.bpm.value = 110;
  Transport.loop = true;
  Transport.loopStart = 0;
  Transport.loopEnd = "32m";

  useEffect(() => {
    musicNodes.forEach(({ player, analyser, supportivePlayer }) => {
      player.toDestination();
      player.connect(analyser);
      analyser.update();
      supportivePlayer?.toDestination();
    });

    secondaryMusicNodes.forEach((node) => {
      node.player.toDestination();
    });
  }, []);

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
        setTimeout(() => {
          Transport.start();
        }, 100);
      }

      const { player, supportivePlayer } = musicNodes[index];

      const activePlayers = activeNodes.map((o, i) => (i === index ? !o : o));

      if (player.state === "stopped") {
        setActiveNodes(activePlayers);
        player.sync().start(0);
        supportivePlayer?.sync().start(0);
      } else {
        setActiveNodes(activePlayers);
        player.stop().unsync();
        supportivePlayer?.stop().unsync();

        const activeNodes = musicNodes.find(
          (node) => node.player.state === "started"
        );

        if (!activeNodes && Transport.state === "started") {
          setTimeout(() => {
            Transport.stop();
          }, 100);
        }
      }

      if (
        secondaryMusicNodes[0].player.state === "stopped" &&
        [musicNodes[0], musicNodes[1], musicNodes[2]].every(
          (node) => node.player.state === "started"
        )
      ) {
        secondaryMusicNodes[0].player.sync().start(0);
      } else if (
        secondaryMusicNodes[0].player.state === "started" &&
        ![musicNodes[0], musicNodes[1], musicNodes[2]].every(
          (node) => node.player.state === "started"
        )
      ) {
        secondaryMusicNodes[0].player.stop().unsync();
      }

      if (
        secondaryMusicNodes[1].player.state === "stopped" &&
        [musicNodes[3], musicNodes[4]].every(
          (node) => node.player.state === "started"
        )
      ) {
        secondaryMusicNodes[1].player.sync().start(0);
      } else if (
        secondaryMusicNodes[1].player.state === "started" &&
        ![musicNodes[3], musicNodes[4]].every(
          (node) => node.player.state === "started"
        )
      ) {
        secondaryMusicNodes[1].player.stop().unsync();
      }

      if (
        secondaryMusicNodes[2].player.state === "stopped" &&
        musicNodes.every((node) => node.player.state === "started")
      ) {
        secondaryMusicNodes[2].player.sync().start(0);
      } else if (
        secondaryMusicNodes[2].player.state === "started" &&
        !musicNodes.every((node) => node.player.state === "started")
      ) {
        secondaryMusicNodes[2].player.stop().unsync();
      }
    },
    [initializeTone, hasBeenInteractedWith, activeNodes]
  );

  return (
    <>
      <color attach="background" args={[0, 0, 0]} />
      <pointLight position={[10, 5, 10]} distance={50} intensity={0.5} />
      <OrbitControls />

      <CameraShake
        yawFrequency={0.2}
        pitchFrequency={0.2}
        rollFrequency={0.2}
      />

      <Swarm count={5000} />
      {musicNodes.map((o, i) => i < 3 && <SwarmPointLight key={i} {...o} />)}

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
          {/* <LightningLight {...musicNodes[4]} /> */}
          <MusicPointsLights {...musicNodes[3]} />
        </>
      </EffectComposer>
    </>
  );
};

export default Scene;
