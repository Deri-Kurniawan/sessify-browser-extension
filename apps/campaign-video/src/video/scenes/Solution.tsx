import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, pop } from "../anim";
import {
  PixelChip,
  PixelIcon,
  PixelLogo,
  PixelPanel,
} from "../components/Pixel";
import { SceneHeading, SceneShell } from "../components/SceneChrome";
import { BODY_FONT, PIXEL_FONT } from "../fonts";
import { C } from "../theme";

const ACCOUNTS = [
  { name: "Main account", color: "#6366f1", y: 108 },
  { name: "Second account", color: "#0ea5e9", y: 250 },
  { name: "Client workspace", color: "#10b981", y: 392 },
];

export const Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const heading = pop({ frame, fps, delay: 4, damping: 18 });
  const panel = pop({ frame, fps, delay: 14, damping: 16 });
  const ring = interpolate(frame, [35, 100], [0, 1], clamp);
  const bullets = [
    "Save the signed-in state",
    "Switch accounts in one click",
    "No logout. No relogin.",
  ];

  return (
    <SceneShell
      caption="Keep the login. Skip the loop."
      captionAccent={C.lime}
      tone="dusk"
    >
      <div style={{ left: 140, position: "absolute", top: 230, width: 720 }}>
        <SceneHeading accent={C.lime} kicker="ENTER SESSIFY" progress={heading}>
          Log in once.
          <br />
          <span style={{ color: C.lime }}>Restore anytime.</span>
        </SceneHeading>
        <div
          style={{
            color: C.muted,
            fontFamily: BODY_FONT,
            fontSize: 34,
            letterSpacing: 0.5,
            lineHeight: 1.25,
            marginTop: 26,
            maxWidth: 660,
            opacity: heading,
          }}
        >
          Sessify saves the signed-in state of a site — cookies and storage — so
          you can switch accounts without typing your password again.
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginTop: 34,
          }}
        >
          {bullets.map((bullet, index) => {
            const value = pop({
              frame,
              fps,
              delay: 40 + index * 10,
              damping: 16,
            });
            return (
              <div
                key={bullet}
                style={{
                  alignItems: "center",
                  display: "flex",
                  gap: 12,
                  opacity: value,
                  transform: `translateX(${(1 - value) * -18}px)`,
                }}
              >
                <div
                  style={{
                    alignItems: "center",
                    background: C.lime,
                    border: `3px solid ${C.ink}`,
                    display: "flex",
                    height: 30,
                    justifyContent: "center",
                    width: 30,
                  }}
                >
                  <PixelIcon color={C.ink} name="check" size={20} />
                </div>
                <span
                  style={{
                    color: C.cream,
                    fontFamily: BODY_FONT,
                    fontSize: 32,
                    letterSpacing: 0.5,
                  }}
                >
                  {bullet}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          left: 940,
          opacity: panel,
          position: "absolute",
          top: 190,
          transform: `translateY(${(1 - panel) * 30}px)`,
        }}
      >
        <PixelPanel accent={C.lime} style={{ height: 700, width: 800 }}>
          <div
            style={{
              color: C.dim,
              fontFamily: PIXEL_FONT,
              fontSize: 10,
              letterSpacing: 1,
            }}
          >
            SAVED LOGINS :: APP.ACME.CO
          </div>
          <div style={{ height: 520, position: "relative" }}>
            <div
              style={{
                alignItems: "center",
                background: "rgba(100,230,255,0.06)",
                border: `3px dashed rgba(184,242,122,${0.25 + ring * 0.35})`,
                borderRadius: "50%",
                display: "flex",
                height: 230 + ring * 24,
                justifyContent: "center",
                left: "50%",
                position: "absolute",
                top: 160,
                translate: "-50% 0",
                width: 230 + ring * 24,
              }}
            >
              <PixelLogo size={112} />
            </div>

            {ACCOUNTS.map((site, index) => {
              const value = pop({
                frame,
                fps,
                delay: 30 + index * 9,
                damping: 15,
              });
              return (
                <div
                  key={site.name}
                  style={{
                    alignItems: "center",
                    background: "rgba(8,11,22,0.86)",
                    border: `3px solid ${C.ink}`,
                    boxShadow: "5px 5px 0 rgba(0,0,0,0.4)",
                    display: "flex",
                    gap: 10,
                    left: 20,
                    opacity: value,
                    padding: "10px 12px",
                    position: "absolute",
                    top: site.y,
                    transform: `translateX(${(1 - value) * -28}px)`,
                    width: 250,
                  }}
                >
                  <div
                    style={{
                      background: site.color,
                      border: `2px solid ${C.ink}`,
                      height: 20,
                      width: 20,
                    }}
                  />
                  <span
                    style={{
                      color: C.cream,
                      fontFamily: BODY_FONT,
                      fontSize: 23,
                      letterSpacing: 0.4,
                    }}
                  >
                    {site.name}
                  </span>
                </div>
              );
            })}

            {ACCOUNTS.map((site, index) => {
              const value = pop({
                frame,
                fps,
                delay: 46 + index * 9,
                damping: 15,
              });
              return (
                <div
                  key={`${site.name}-out`}
                  style={{
                    alignItems: "center",
                    background: "rgba(184,242,122,0.1)",
                    border: `3px solid ${C.lime}`,
                    display: "flex",
                    gap: 8,
                    opacity: value,
                    padding: "10px 12px",
                    position: "absolute",
                    right: 8,
                    top: site.y + 4,
                    transform: `translateX(${(1 - value) * 28}px)`,
                    width: 230,
                  }}
                >
                  <PixelIcon color={C.lime} name="cards" size={20} />
                  <div>
                    <div
                      style={{
                        color: C.cream,
                        fontFamily: BODY_FONT,
                        fontSize: 21,
                        lineHeight: 1,
                      }}
                    >
                      SIGNED IN
                    </div>
                    <div
                      style={{
                        color: C.dim,
                        fontFamily: BODY_FONT,
                        fontSize: 16,
                        lineHeight: 1.2,
                      }}
                    >
                      restore anytime
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <PixelChip color={C.lime}>login once</PixelChip>
            <PixelChip color={C.cyan}>stored locally</PixelChip>
            <PixelChip color={C.pink}>restore anytime</PixelChip>
          </div>
        </PixelPanel>
      </div>

      <div
        style={{
          bottom: 190,
          color: C.dim,
          fontFamily: BODY_FONT,
          fontSize: 22,
          left: 150,
          position: "absolute",
        }}
      >
        SAVE → SWITCH → RESTORE
      </div>
    </SceneShell>
  );
};
