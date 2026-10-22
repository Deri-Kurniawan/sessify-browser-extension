import { AbsoluteFill, interpolate, Series, useCurrentFrame } from "remotion";
import { clamp } from "./anim";
import { Soundtrack } from "./audio";
import { Scanlines } from "./components/Pixel";
import { BODY_FONT, PIXEL_FONT } from "./fonts";
import { Features } from "./scenes/Features";
import { GetStarted } from "./scenes/GetStarted";
import { Intro } from "./scenes/Intro";
import { Manage } from "./scenes/Manage";
import { Outro } from "./scenes/Outro";
import { Problem } from "./scenes/Problem";
import { Save } from "./scenes/Save";
import { Solution } from "./scenes/Solution";
import { Switch } from "./scenes/Switch";
import { C } from "./theme";

const SCENES = [
  { Component: Intro, duration: 210, color: C.cyan, label: "INTRO" },
  { Component: Problem, duration: 240, color: C.red, label: "PROBLEM" },
  { Component: Solution, duration: 180, color: C.lime, label: "SOLUTION" },
  { Component: Save, duration: 360, color: C.blue, label: "SAVE" },
  { Component: Switch, duration: 480, color: C.cyan, label: "SWITCH" },
  { Component: Manage, duration: 420, color: C.amber, label: "MANAGE" },
  { Component: Features, duration: 360, color: C.pink, label: "FEATURES" },
  { Component: GetStarted, duration: 270, color: C.lime, label: "START" },
  { Component: Outro, duration: 240, color: C.amber, label: "OUTRO" },
] as const;

export const TOTAL_DURATION = SCENES.reduce(
  (sum, scene) => sum + scene.duration,
  0,
);

const BOUNDARIES = SCENES.slice(1).map((_, index) =>
  SCENES.slice(0, index + 1).reduce((sum, scene) => sum + scene.duration, 0),
);

const WIPE = 13;
const COLUMNS = 16;

const TransitionWipe: React.FC = () => {
  const frame = useCurrentFrame();
  let nearest: number | null = null;
  for (const boundary of BOUNDARIES) {
    if (Math.abs(frame - boundary) <= WIPE) {
      nearest = boundary;
    }
  }
  if (nearest === null) {
    return null;
  }
  const local = frame - nearest;
  const progress = local < 0 ? 1 - Math.abs(local) / WIPE : 1 - local / WIPE;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 500 }}>
      {Array.from({ length: COLUMNS }).map((_, index) => {
        const delay = index * 0.018;
        const columnProgress = interpolate(progress, [delay, 1], [0, 1], clamp);
        const color =
          index % 4 === 0
            ? C.ink
            : index % 4 === 1
              ? "#0c1226"
              : index % 4 === 2
                ? "#101a38"
                : C.ink;
        return (
          <div
            key={index}
            style={{
              background: color,
              bottom: local < 0 ? 0 : undefined,
              height: `${columnProgress * 100}%`,
              left: index * (1920 / COLUMNS),
              position: "absolute",
              top: local < 0 ? undefined : 0,
              width: 1920 / COLUMNS + 1,
            }}
          >
            <div
              style={{
                background:
                  index % 3 === 0 ? "rgba(100,230,255,0.24)" : "transparent",
                height: 6,
                width: "100%",
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Hud: React.FC = () => {
  const frame = useCurrentFrame();
  const seconds = Math.floor(frame / 30);
  const timecode = `00:${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const blink = Math.sin(frame * 0.22) > -0.2;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 400 }}>
      <div
        style={{
          alignItems: "center",
          color: C.cream,
          display: "flex",
          fontFamily: PIXEL_FONT,
          fontSize: 9,
          gap: 8,
          left: 34,
          letterSpacing: 0.5,
          opacity: 0.82,
          position: "absolute",
          top: 16,
        }}
      >
        <span style={{ background: C.cyan, height: 7, width: 7 }} />
        SESSIFY
        <span style={{ color: C.dim }}>/</span>
        <span style={{ color: C.dim }}>PRODUCT TOUR</span>
      </div>

      <div
        style={{
          alignItems: "center",
          color: C.cream,
          display: "flex",
          fontFamily: PIXEL_FONT,
          fontSize: 9,
          gap: 8,
          opacity: 0.78,
          position: "absolute",
          right: 34,
          top: 16,
        }}
      >
        <span style={{ color: blink ? C.red : C.dim }}>●</span>
        <span style={{ color: blink ? C.red : C.dim }}>REC</span>
        <span style={{ color: C.dim }}>{timecode}</span>
      </div>

      <div
        style={{
          alignItems: "flex-end",
          bottom: 8,
          display: "flex",
          height: 5,
          left: 0,
          position: "absolute",
          right: 0,
        }}
      >
        {SCENES.map((scene, index) => {
          const start = SCENES.slice(0, index).reduce(
            (sum, item) => sum + item.duration,
            0,
          );
          const active = frame >= start && frame < start + scene.duration;
          return (
            <div
              key={scene.label}
              style={{
                background: active ? scene.color : "rgba(255,255,255,0.15)",
                flex: scene.duration,
                height: active ? 5 : 3,
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const ChapterTag: React.FC = () => {
  const frame = useCurrentFrame();
  let index = SCENES.length - 1;
  let cursor = 0;
  for (let i = 0; i < SCENES.length; i++) {
    if (frame < cursor + SCENES[i].duration) {
      index = i;
      break;
    }
    cursor += SCENES[i].duration;
  }
  const label = `${(index + 1).toString().padStart(2, "0")} / ${SCENES.length.toString().padStart(2, "0")}`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 401 }}>
      <div
        style={{
          bottom: 18,
          color: C.dim,
          fontFamily: BODY_FONT,
          fontSize: 18,
          letterSpacing: 2,
          opacity: 0.65,
          position: "absolute",
          right: 34,
        }}
      >
        SESSIFY · {label}
      </div>
    </AbsoluteFill>
  );
};

export const SessifyVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: C.ink, fontFamily: BODY_FONT }}>
      <Series>
        {SCENES.map((scene) => (
          <Series.Sequence durationInFrames={scene.duration} key={scene.label}>
            <scene.Component />
          </Series.Sequence>
        ))}
      </Series>

      <Scanlines />
      <TransitionWipe />
      <Hud />
      <ChapterTag />
      <AbsoluteFill
        style={{
          background: "#000",
          opacity: fadeIn,
          pointerEvents: "none",
          zIndex: 600,
        }}
      />
      <Soundtrack />
    </AbsoluteFill>
  );
};
