import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, cursorPath, pop } from "../anim";
import {
  PixelCursor,
  PixelIcon,
  type PixelIconName,
  PixelLogo,
  PixelPanel,
} from "../components/Pixel";
import { SceneHeading, SceneShell } from "../components/SceneChrome";
import { BODY_FONT, PIXEL_FONT } from "../fonts";
import { C } from "../theme";

const STEPS: {
  icon: PixelIconName;
  title: string;
  body: string;
  color: string;
}[] = [
  {
    icon: "download",
    title: "INSTALL",
    body: "Add Sessify to a Chromium browser or Firefox.",
    color: C.cyan,
  },
  {
    icon: "browser",
    title: "PIN",
    body: "Pin the icon to your browser toolbar.",
    color: C.lime,
  },
  {
    icon: "bolt",
    title: "SAVE",
    body: "Open a site and save your signed-in session.",
    color: C.pink,
  },
];

const CONFETTI = Array.from({ length: 36 }, (_, index) => ({
  x: 60 + ((index * 131) % 660),
  y: 38 + ((index * 89) % 250),
  color: [C.cyan, C.lime, C.pink, C.amber][index % 4],
  size: 5 + (index % 3) * 3,
  delay: (index % 9) * 2,
}));

export const GetStarted: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const heading = pop({ frame, fps, delay: 4, damping: 18 });
  const panel = pop({ frame, fps, delay: 18, damping: 16 });
  const installed = frame >= 196;
  const installPop = pop({
    frame,
    fps,
    delay: 196,
    damping: 10,
    stiffness: 210,
  });
  const hovering = frame >= 148 && frame < 196;
  const cursor = cursorPath(frame, [
    { at: 0, x: 1660, y: 900 },
    { at: 110, x: 1280, y: 680 },
    { at: 148, x: 1150, y: 600 },
    { at: 190, x: 1150, y: 600 },
    { at: 216, x: 1320, y: 720 },
    { at: 270, x: 1320, y: 720 },
  ]);
  const pressed = Math.abs(frame - 186) <= 5;
  const ripple = (() => {
    const t = (frame - 186) / 20;
    return t > 0 && t < 1 ? 1 - t : 0;
  })();
  const stamp = interpolate(frame, [210, 235], [0, 1], clamp);

  return (
    <SceneShell
      caption="Install once. Save logins forever."
      captionAccent={C.lime}
      tone="blue"
    >
      <div style={{ left: 140, position: "absolute", top: 156, width: 720 }}>
        <SceneHeading accent={C.cyan} kicker="GET STARTED" progress={heading}>
          UP AND RUNNING
          <br />
          IN <span style={{ color: C.lime }}>30 SECONDS.</span>
        </SceneHeading>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: 38,
          }}
        >
          {STEPS.map((step, index) => {
            const value = pop({
              frame,
              fps,
              delay: 24 + index * 14,
              damping: 16,
            });
            return (
              <div
                key={step.title}
                style={{
                  alignItems: "center",
                  background: "rgba(8,11,22,0.72)",
                  border: `3px solid ${C.ink}`,
                  boxShadow: "6px 6px 0 rgba(0,0,0,0.35)",
                  display: "flex",
                  gap: 16,
                  opacity: Math.min(1, value * 1.5),
                  padding: "14px 18px",
                  transform: `translateX(${(1 - value) * -26}px)`,
                }}
              >
                <div
                  style={{
                    alignItems: "center",
                    background: step.color,
                    border: `3px solid ${C.ink}`,
                    color: C.ink,
                    display: "flex",
                    fontFamily: PIXEL_FONT,
                    fontSize: 16,
                    height: 48,
                    justifyContent: "center",
                    width: 48,
                  }}
                >
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{ alignItems: "center", display: "flex", gap: 8 }}
                  >
                    <PixelIcon color={step.color} name={step.icon} size={20} />
                    <span
                      style={{
                        color: step.color,
                        fontFamily: PIXEL_FONT,
                        fontSize: 12,
                        lineHeight: 1.6,
                      }}
                    >
                      {step.title}
                    </span>
                  </div>
                  <div
                    style={{
                      color: C.cream,
                      fontFamily: BODY_FONT,
                      fontSize: 27,
                      letterSpacing: 0.4,
                      lineHeight: 1.1,
                    }}
                  >
                    {step.body}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          left: 980,
          opacity: panel,
          position: "absolute",
          top: 188,
          transform: `translateY(${(1 - panel) * 30}px)`,
        }}
      >
        <PixelPanel accent={C.cyan} style={{ height: 664, width: 760 }}>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                color: C.dim,
                fontFamily: PIXEL_FONT,
                fontSize: 10,
                letterSpacing: 1,
              }}
            >
              SESSIFY ADD-ON
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              {[C.pink, C.amber, C.lime].map((color) => (
                <div
                  key={color}
                  style={{ background: color, height: 9, width: 9 }}
                />
              ))}
            </div>
          </div>

          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: 22,
              marginTop: 28,
            }}
          >
            <PixelLogo size={104} />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  color: C.cream,
                  fontFamily: PIXEL_FONT,
                  fontSize: 20,
                  lineHeight: 1.6,
                }}
              >
                SESSIFY
              </div>
              <div
                style={{
                  color: C.cyan,
                  fontFamily: BODY_FONT,
                  fontSize: 27,
                  letterSpacing: 0.5,
                  lineHeight: 1.1,
                }}
              >
                Save your signed-in sessions
              </div>
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  gap: 7,
                  marginTop: 8,
                }}
              >
                <PixelIcon color={C.lime} name="check" size={16} />
                <span
                  style={{ color: C.dim, fontFamily: BODY_FONT, fontSize: 20 }}
                >
                  Chromium + Firefox · no account needed
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "rgba(0,0,0,0.24)",
              border: "2px solid #2a355c",
              color: C.muted,
              fontFamily: BODY_FONT,
              fontSize: 24,
              letterSpacing: 0.4,
              lineHeight: 1.2,
              marginTop: 24,
              padding: 16,
            }}
          >
            Save the signed-in state of a site, then restore it whenever you
            need it. No password re-entry. Sessions stay on your device.
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <div
              style={{
                alignItems: "center",
                background: "rgba(0,0,0,0.24)",
                border: "2px solid #2a355c",
                color: C.cream,
                display: "flex",
                fontFamily: BODY_FONT,
                fontSize: 21,
                gap: 6,
                padding: "7px 10px",
              }}
            >
              <PixelIcon color={C.lime} name="shield" size={17} />
              100% local
            </div>
            <div
              style={{
                alignItems: "center",
                background: "rgba(0,0,0,0.24)",
                border: "2px solid #2a355c",
                color: C.cream,
                display: "flex",
                fontFamily: BODY_FONT,
                fontSize: 21,
                gap: 6,
                padding: "7px 10px",
              }}
            >
              <PixelIcon color={C.cyan} name="browser" size={17} />
              Chromium + Firefox
            </div>
          </div>

          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: 14,
              marginTop: 28,
            }}
          >
            <div
              style={{
                alignItems: "center",
                background: installed ? C.lime : C.cream,
                border: `4px solid ${hovering ? C.cyan : C.ink}`,
                boxShadow: pressed
                  ? "2px 2px 0 rgba(0,0,0,0.5)"
                  : hovering
                    ? "6px 6px 0 rgba(0,0,0,0.5), 0 0 24px rgba(100,230,255,0.35)"
                    : "6px 6px 0 rgba(0,0,0,0.5)",
                color: C.ink,
                display: "flex",
                fontFamily: PIXEL_FONT,
                fontSize: 15,
                gap: 10,
                justifyContent: "center",
                lineHeight: 1.5,
                padding: "18px 24px",
                transform: pressed ? "translate(4px,4px)" : "none",
              }}
            >
              {installed ? (
                <PixelIcon color={C.ink} name="check" size={20} />
              ) : (
                <PixelIcon color={C.ink} name="plus" size={18} />
              )}
              {installed ? "INSTALLED" : "ADD TO BROWSER"}
            </div>
            <div
              style={{
                color: C.dim,
                fontFamily: BODY_FONT,
                fontSize: 23,
                lineHeight: 1.15,
              }}
            >
              Free · No account
              <br />
              Chromium + Firefox
            </div>
          </div>

          {installed ? (
            <div
              style={{
                alignItems: "center",
                background: C.lime,
                border: `4px solid ${C.ink}`,
                boxShadow: "8px 8px 0 rgba(0,0,0,0.5)",
                color: C.ink,
                display: "flex",
                fontFamily: PIXEL_FONT,
                fontSize: 16,
                gap: 8,
                opacity: Math.min(1, installPop * 1.6),
                padding: "12px 18px",
                position: "absolute",
                right: 28,
                top: 500,
                transform: `rotate(-3deg) scale(${0.7 + installPop * 0.3})`,
              }}
            >
              <PixelIcon color={C.ink} name="check" size={18} />
              READY TO SAVE
            </div>
          ) : null}

          {installed
            ? CONFETTI.map((piece, index) => {
                const value = pop({
                  frame,
                  fps,
                  delay: 196 + piece.delay,
                  damping: 12,
                });
                const drift = (1 - value) * -80;
                return (
                  <div
                    key={index}
                    style={{
                      background: piece.color,
                      height: piece.size,
                      left: 10 + piece.x,
                      opacity:
                        stamp *
                        (1 -
                          interpolate(frame, [240, 268], [0, 1], clamp) * 0.7),
                      position: "absolute",
                      top: 10 + piece.y,
                      transform: `translateY(${drift}px) rotate(${(1 - value) * 180}deg)`,
                      width: piece.size,
                    }}
                  />
                );
              })
            : null}
        </PixelPanel>
      </div>

      <PixelCursor
        pressed={pressed}
        ripple={ripple}
        x={cursor.x}
        y={cursor.y}
      />
    </SceneShell>
  );
};
