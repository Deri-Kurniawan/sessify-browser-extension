import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, pop } from "../anim";
import { PixelChip, PixelIcon, type PixelIconName } from "../components/Pixel";
import { SceneHeading, SceneShell } from "../components/SceneChrome";
import { BODY_FONT, PIXEL_FONT } from "../fonts";
import { C } from "../theme";

const FEATURES: {
  icon: PixelIconName;
  title: string;
  body: string;
  color: string;
}[] = [
  {
    icon: "cards",
    title: "SAVE SESSION",
    body: "Capture the signed-in state in one click.",
    color: C.cyan,
  },
  {
    icon: "bolt",
    title: "ONE-CLICK RESTORE",
    body: "Skip the login screen and get back in.",
    color: C.lime,
  },
  {
    icon: "users",
    title: "MULTIPLE ACCOUNTS",
    body: "Keep main, work, and client accounts separate.",
    color: C.pink,
  },
  {
    icon: "sparkle",
    title: "NAME EACH SESSION",
    body: "Rename saves so the right account is obvious.",
    color: C.purple,
  },
  {
    icon: "shield",
    title: "100% LOCAL",
    body: "Saved in your browser. Nothing leaves your device.",
    color: C.amber,
  },
  {
    icon: "browser",
    title: "CHROMIUM + FIREFOX",
    body: "Same simple workflow in Chromium browsers and Firefox.",
    color: C.orange,
  },
];

export const Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const heading = pop({ frame, fps, delay: 4, damping: 18 });
  const accentPulse = (index: number) =>
    0.4 + Math.abs(Math.sin(frame * 0.045 + index)) * 0.6;

  return (
    <SceneShell
      caption="Less logging in. More getting on with it."
      captionAccent={C.lime}
      tone="dusk"
    >
      <div
        style={{
          left: 0,
          position: "absolute",
          right: 0,
          top: 68,
          textAlign: "center",
        }}
      >
        <SceneHeading
          accent={C.lime}
          align="center"
          kicker="THE TOOLKIT"
          progress={heading}
        >
          BUILT FOR <span style={{ color: C.lime }}>ACCOUNT SWITCHERS</span>
        </SceneHeading>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          position: "absolute",
          right: 140,
          top: 96,
        }}
      >
        <PixelChip color={C.lime}>6 reasons</PixelChip>
      </div>

      <div
        style={{
          display: "grid",
          gap: 22,
          gridTemplateColumns: "repeat(3, 500px)",
          left: 140,
          position: "absolute",
          top: 286,
        }}
      >
        {FEATURES.map((feature, index) => {
          const value = pop({
            frame,
            fps,
            delay: 14 + index * 12,
            damping: 15,
          });
          const glow = interpolate(
            frame,
            [45 + index * 12, 60 + index * 12],
            [0, 1],
            clamp,
          );
          return (
            <div
              key={feature.title}
              style={{
                background:
                  "linear-gradient(165deg, rgba(28,36,64,0.97), rgba(15,20,38,0.97))",
                border: `3px solid ${C.ink}`,
                boxShadow: "9px 9px 0 rgba(0,0,0,0.45)",
                height: 238,
                opacity: Math.min(1, value * 1.6),
                padding: 24,
                position: "relative",
                transform: `translateY(${(1 - value) * 34}px) scale(${0.94 + value * 0.06})`,
              }}
            >
              <div
                style={{
                  background: feature.color,
                  height: 4,
                  left: 0,
                  opacity: accentPulse(index),
                  position: "absolute",
                  right: 0,
                  top: 0,
                }}
              />
              <div
                style={{
                  alignItems: "flex-start",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    alignItems: "center",
                    background: "rgba(0,0,0,0.28)",
                    border: `3px solid ${feature.color}`,
                    boxShadow: `0 0 ${18 + glow * 16}px ${feature.color}33`,
                    display: "flex",
                    height: 62,
                    justifyContent: "center",
                    width: 62,
                  }}
                >
                  <PixelIcon
                    color={feature.color}
                    name={feature.icon}
                    size={34}
                  />
                </div>
                <span
                  style={{
                    color: "rgba(255,255,255,0.11)",
                    fontFamily: PIXEL_FONT,
                    fontSize: 30,
                    lineHeight: 1,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div
                style={{
                  color: C.cream,
                  fontFamily: PIXEL_FONT,
                  fontSize: 15,
                  letterSpacing: 0.3,
                  lineHeight: 1.7,
                  marginTop: 18,
                  textShadow: `3px 3px 0 ${C.ink}`,
                }}
              >
                {feature.title}
              </div>
              <div
                style={{
                  color: C.muted,
                  fontFamily: BODY_FONT,
                  fontSize: 25,
                  letterSpacing: 0.4,
                  lineHeight: 1.1,
                  marginTop: 6,
                }}
              >
                {feature.body}
              </div>
              <div
                style={{
                  background: `linear-gradient(90deg, ${feature.color}, transparent)`,
                  bottom: 0,
                  height: 3,
                  left: 24,
                  opacity: 0.4,
                  position: "absolute",
                  width: 120,
                }}
              />
            </div>
          );
        })}
      </div>

      <div
        style={{
          bottom: 110,
          color: C.dim,
          fontFamily: BODY_FONT,
          fontSize: 23,
          left: 140,
          letterSpacing: 1,
          position: "absolute",
        }}
      >
        SAVE · SWITCH · RESTORE · REPEAT
      </div>
    </SceneShell>
  );
};
