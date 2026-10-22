import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp, pop, typewriter } from "../anim";
import { PixelChip, PixelLogo } from "../components/Pixel";
import { SceneShell } from "../components/SceneChrome";
import { BODY_FONT, PIXEL_FONT } from "../fonts";
import { C } from "../theme";

const WORD = "SESSIFY";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logo = pop({ frame, fps, delay: 12, damping: 11, stiffness: 150 });
  const glow = interpolate(frame, [0, 45, 150, 210], [0, 0.8, 0.8, 1], clamp);
  const subtitle = pop({ frame, fps, delay: 64, damping: 18 });
  const chips = pop({ frame, fps, delay: 92, damping: 18 });
  const lift = interpolate(frame, [120, 180], [0, -18], clamp);
  const boot = typewriter("> booting session engine...", frame, 0, 22);
  const ready = frame > 30;

  return (
    <SceneShell tone="blue">
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          translate: `0px ${lift}px`,
        }}
      >
        <div
          style={{
            background: `radial-gradient(circle, rgba(79,140,255,${0.22 * glow}) 0%, rgba(100,230,255,0.08) 36%, transparent 66%)`,
            height: 900,
            position: "absolute",
            width: 1200,
          }}
        />
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: 28,
            opacity: Math.min(1, logo * 2),
            transform: `scale(${0.7 + logo * 0.3})`,
          }}
        >
          <PixelLogo size={140} />
          <div style={{ display: "flex", gap: 2 }}>
            {WORD.split("").map((letter, index) => {
              const value = pop({
                frame,
                fps,
                delay: 20 + index * 4,
                damping: 10,
                stiffness: 190,
              });
              return (
                <span
                  key={`${letter}-${index}`}
                  style={{
                    color: C.cream,
                    display: "inline-block",
                    fontFamily: PIXEL_FONT,
                    fontSize: 88,
                    lineHeight: 1,
                    opacity: Math.min(1, value * 3),
                    textShadow: `7px 7px 0 ${C.ink}, 0 0 36px rgba(100,230,255,0.25)`,
                    transform: `translateY(${(1 - value) * 50}px)`,
                  }}
                >
                  {letter}
                </span>
              );
            })}
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: 34,
            opacity: Math.min(1, subtitle * 1.4),
            transform: `translateY(${(1 - subtitle) * 18}px)`,
          }}
        >
          <div
            style={{
              color: C.cyan,
              fontFamily: BODY_FONT,
              fontSize: 46,
              letterSpacing: 3,
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            Log in once. Restore anytime.
          </div>
          <div
            style={{
              color: C.muted,
              fontFamily: BODY_FONT,
              fontSize: 30,
              letterSpacing: 1,
              lineHeight: 1,
            }}
          >
            save the session · skip the login screen
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 14,
            marginTop: 34,
            opacity: chips,
            transform: `translateY(${(1 - chips) * 14}px)`,
          }}
        >
          <PixelChip color={C.cyan}>Save session</PixelChip>
          <PixelChip color={C.lime}>Switch accounts</PixelChip>
          <PixelChip color={C.pink}>100% local</PixelChip>
        </div>
      </AbsoluteFill>

      <div
        style={{
          color: C.lime,
          fontFamily: BODY_FONT,
          fontSize: 24,
          left: 54,
          letterSpacing: 1,
          lineHeight: 1.2,
          opacity: 0.85,
          position: "absolute",
          top: 46,
        }}
      >
        <div>{boot}</div>
        <div style={{ color: ready ? C.cyan : "transparent" }}>
          {ready ? "> display ready." : ""}
        </div>
      </div>

      <div
        style={{
          bottom: 52,
          color: C.dim,
          fontFamily: PIXEL_FONT,
          fontSize: 10,
          left: "50%",
          letterSpacing: 1,
          opacity: Math.sin(frame * 0.12) > -0.2 ? 0.9 : 0.2,
          position: "absolute",
          translate: "-50% 0",
          whiteSpace: "nowrap",
        }}
      >
        INSERT COIN · PRESS START
      </div>
    </SceneShell>
  );
};
