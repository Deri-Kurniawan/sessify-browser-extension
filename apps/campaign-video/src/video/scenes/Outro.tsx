import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp, pop } from "../anim";
import { PixelChip, PixelIcon, PixelLogo } from "../components/Pixel";
import { SceneShell } from "../components/SceneChrome";
import { BODY_FONT, PIXEL_FONT } from "../fonts";
import { C } from "../theme";

const WORD = "SESSIFY";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = pop({ frame, fps, delay: 4, damping: 12, stiffness: 160 });
  const tagline = pop({ frame, fps, delay: 32, damping: 18 });
  const cta = pop({ frame, fps, delay: 56, damping: 16 });

  const close = interpolate(frame, [194, 212], [0, 1], clamp);
  const lineWidth = interpolate(frame, [212, 226], [1, 0.004], clamp);
  const dot = interpolate(frame, [222, 234], [1, 0], clamp);
  const power = frame >= 194;

  return (
    <SceneShell tone="gold">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: 22,
            opacity: 1 - close * 0.35,
            transform: `scale(${1 + close * 0.06})`,
          }}
        >
          <PixelLogo
            size={124}
            style={{ opacity: logo, transform: `scale(${0.7 + logo * 0.3})` }}
          />
          <div style={{ display: "flex", gap: 2 }}>
            {WORD.split("").map((letter, index) => {
              const value = pop({
                frame,
                fps,
                delay: 8 + index * 4,
                damping: 11,
                stiffness: 180,
              });
              return (
                <span
                  key={`${letter}-${index}`}
                  style={{
                    color: C.cream,
                    display: "inline-block",
                    fontFamily: PIXEL_FONT,
                    fontSize: 78,
                    lineHeight: 1,
                    opacity: Math.min(1, value * 3),
                    textShadow: `7px 7px 0 ${C.ink}, 0 0 40px rgba(255,209,102,0.18)`,
                    transform: `translateY(${(1 - value) * 44}px)`,
                  }}
                >
                  {letter}
                </span>
              );
            })}
          </div>

          <div
            style={{
              color: C.cyan,
              fontFamily: BODY_FONT,
              fontSize: 42,
              letterSpacing: 4,
              lineHeight: 1,
              opacity: tagline,
              transform: `translateY(${(1 - tagline) * 16}px)`,
            }}
          >
            LOG IN ONCE. RESTORE ANYTIME.
          </div>

          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginTop: 14,
              opacity: cta,
            }}
          >
            <div
              style={{
                alignItems: "center",
                background: "rgba(8,11,22,0.85)",
                border: `4px solid ${C.lime}`,
                boxShadow: "7px 7px 0 rgba(0,0,0,0.45)",
                color: C.cream,
                display: "flex",
                fontFamily: PIXEL_FONT,
                fontSize: 20,
                gap: 12,
                padding: "16px 22px",
              }}
            >
              <PixelIcon color={C.lime} name="browser" size={24} />
              sessify.derikn.com
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <PixelChip color={C.cyan}>free</PixelChip>
              <PixelChip color={C.lime}>chromium + firefox</PixelChip>
              <PixelChip color={C.pink}>100% local</PixelChip>
            </div>
          </div>

          <div
            style={{
              color: C.dim,
              fontFamily: BODY_FONT,
              fontSize: 24,
              letterSpacing: 2,
              marginTop: 8,
              opacity: cta * 0.9,
            }}
          >
            save the login · skip the loop
          </div>
        </div>
      </AbsoluteFill>

      {power ? (
        <AbsoluteFill style={{ zIndex: 300 }}>
          <div
            style={{
              background: C.ink,
              height: 540 * close,
              left: 0,
              position: "absolute",
              top: 0,
              right: 0,
            }}
          />
          <div
            style={{
              background: C.ink,
              bottom: 0,
              height: 540 * close,
              left: 0,
              position: "absolute",
              right: 0,
            }}
          />
          <div
            style={{
              background: C.white,
              boxShadow: `0 0 40px ${C.cyan}`,
              height: Math.max(3, 6 * dot),
              left: "50%",
              opacity: 0.55 + dot * 0.45,
              position: "absolute",
              top: "50%",
              transform: `translate(-50%, -50%) scaleX(${lineWidth})`,
              width: 1920,
            }}
          />
          <div
            style={{
              background: C.cyan,
              borderRadius: "50%",
              boxShadow: `0 0 60px ${C.cyan}`,
              height: Math.max(0, 10 * dot),
              left: "50%",
              opacity: dot,
              position: "absolute",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: Math.max(0, 10 * dot),
            }}
          />
        </AbsoluteFill>
      ) : null}
    </SceneShell>
  );
};
