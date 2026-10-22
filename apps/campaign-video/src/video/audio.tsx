import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp } from "./anim";

type Cue = {
  at: number;
  file: string;
  volume?: number;
};

const c = (at: number, name: string, volume = 0.5): Cue => ({
  at,
  file: `audio/sfx-${name}.wav`,
  volume,
});

const SFX: Cue[] = [
  c(0, "boot", 0.35),
  c(0, "type", 0.18),
  c(12, "pop", 0.32),
  c(20, "tick", 0.14),
  c(24, "tick", 0.14),
  c(28, "tick", 0.14),
  c(32, "tick", 0.14),
  c(36, "tick", 0.14),
  c(40, "tick", 0.14),
  c(44, "tick", 0.14),
  c(64, "pop", 0.28),
  c(92, "pop", 0.25),
  c(196, "whoosh", 0.34),

  c(216, "pop", 0.3),
  c(228, "pop", 0.28),
  c(244, "pop", 0.28),
  c(260, "pop", 0.28),
  c(328, "error", 0.25),
  c(368, "error", 0.25),
  c(400, "glitch", 0.32),
  c(408, "error", 0.26),

  c(450, "whoosh", 0.38),
  c(471, "pop", 0.4),
  c(510, "ding", 0.34),
  c(531, "badge", 0.3),
  c(598, "riser", 0.25),

  c(630, "whoosh", 0.38),
  c(668, "tick", 0.1),
  c(700, "click", 0.38),
  c(702, "success", 0.36),
  c(714, "pop", 0.3),
  c(732, "tick", 0.1),
  c(768, "click", 0.34),
  c(776, "dialog", 0.38),
  c(790, "type", 0.3),
  c(804, "tick", 0.1),
  c(834, "pop", 0.24),
  c(854, "click", 0.34),
  c(856, "success", 0.32),

  c(990, "whoosh", 0.38),
  c(1010, "tick", 0.1),
  c(1030, "click", 0.36),
  c(1036, "dialog", 0.38),
  c(1054, "tick", 0.1),
  c(1070, "click", 0.36),
  c(1072, "whoosh", 0.28),
  c(1094, "type", 0.3),
  c(1140, "tick", 0.1),
  c(1154, "click", 0.36),
  c(1155, "switch", 0.45),
  c(1156, "pop", 0.24),
  c(1180, "tick", 0.1),
  c(1176, "pop", 0.3),
  c(1196, "click", 0.36),
  c(1198, "success", 0.34),
  c(1206, "pop", 0.28),
  c(1206, "badge", 0.26),
  c(1220, "tick", 0.1),
  c(1242, "click", 0.36),
  c(1248, "dialog", 0.38),
  c(1264, "type", 0.3),
  c(1274, "tick", 0.1),
  c(1320, "click", 0.36),
  c(1322, "success", 0.34),
  c(1340, "tick", 0.1),
  c(1362, "click", 0.36),
  c(1363, "switch", 0.45),
  c(1380, "tick", 0.1),
  c(1402, "click", 0.36),
  c(1403, "switch", 0.45),
  c(1452, "whoosh", 0.3),

  c(1470, "whoosh", 0.38),
  c(1494, "tick", 0.1),
  c(1514, "click", 0.36),
  c(1524, "dialog", 0.38),
  c(1580, "whoosh", 0.24),
  c(1590, "tick", 0.1),
  c(1660, "click", 0.34),
  c(1728, "tick", 0.1),
  c(1740, "click", 0.34),
  c(1762, "tick", 0.1),
  c(1774, "click", 0.36),
  c(1782, "dialog", 0.38),
  c(1796, "tick", 0.1),
  c(1814, "click", 0.38),
  c(1830, "success", 0.4),
  c(1832, "badge", 0.3),
  c(1868, "whoosh", 0.32),

  c(1890, "whoosh", 0.38),
  c(1898, "pop", 0.28),
  c(1906, "pop", 0.28),
  c(1914, "pop", 0.28),
  c(1922, "pop", 0.28),
  c(1930, "pop", 0.28),
  c(1938, "pop", 0.28),
  c(1960, "success", 0.32),
  c(2238, "whoosh", 0.32),

  c(2250, "whoosh", 0.38),
  c(2398, "tick", 0.12),
  c(2436, "click", 0.38),
  c(2444, "pop", 0.3),
  c(2446, "success", 0.34),
  c(2460, "ding", 0.24),
  c(2464, "badge", 0.26),
  c(2506, "whoosh", 0.3),

  c(2520, "whoosh", 0.34),
  c(2528, "pop", 0.32),
  c(2550, "success", 0.35),
  c(2552, "ding", 0.25),
  c(2714, "poweroff", 0.4),
];

export const Soundtrack: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const bgmVolume = interpolate(
    frame,
    [0, 18, 210, 450, 630, 990, 1470, 1890, 2250, 2520, 2690, 2760],
    [0, 0.31, 0.3, 0.33, 0.31, 0.34, 0.33, 0.31, 0.33, 0.3, 0.38, 0],
    clamp,
  );

  return (
    <AbsoluteFill>
      <Audio
        src={staticFile("audio/bgm.wav")}
        volume={Math.min(bgmVolume, durationInFrames > 0 ? 1 : 0)}
      />
      {SFX.map((effect) => (
        <Audio
          from={effect.at}
          key={`${effect.at}-${effect.file}`}
          src={staticFile(effect.file)}
          volume={effect.volume ?? 0.5}
        />
      ))}
    </AbsoluteFill>
  );
};
