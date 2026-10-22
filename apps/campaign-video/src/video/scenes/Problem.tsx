import type { CSSProperties } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, pop, slideUp } from "../anim";
import { PixelChip, PixelIcon } from "../components/Pixel";
import {
  SceneHeading,
  SceneShell,
  StatCallout,
} from "../components/SceneChrome";
import { BODY_FONT, PIXEL_FONT } from "../fonts";
import { C } from "../theme";

const MiniWindow: React.FC<{
  title: string;
  domain: string;
  count: string;
  color: string;
  progress: number;
  collapse: number;
  rotate: number;
  style: CSSProperties;
}> = ({ title, domain, count, color, progress, collapse, rotate, style }) => {
  return (
    <div
      style={{
        background: "#0c1226",
        border: `4px solid ${C.ink}`,
        boxShadow: "10px 10px 0 rgba(0,0,0,0.5)",
        opacity: progress * (1 - collapse),
        position: "absolute",
        transform: `rotate(${rotate}deg) scale(${0.86 + progress * 0.14 - collapse * 0.2})`,
        translate: `0px ${(1 - progress) * 26 - collapse * 40}px`,
        ...style,
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: "#151d38",
          borderBottom: `3px solid ${C.ink}`,
          display: "flex",
          gap: 8,
          height: 40,
          padding: "0 12px",
        }}
      >
        {[C.pink, C.amber, C.lime].map((dot) => (
          <div
            key={dot}
            style={{
              background: dot,
              border: `2px solid ${C.ink}`,
              height: 10,
              width: 10,
            }}
          />
        ))}
        <div
          style={{
            background: color,
            height: 14,
            marginLeft: 8,
            width: 14,
          }}
        />
        <span
          style={{
            color: C.cream,
            fontFamily: BODY_FONT,
            fontSize: 21,
            lineHeight: 1,
          }}
        >
          {domain}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          padding: 12,
        }}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            style={{
              alignItems: "center",
              background: "rgba(255,255,255,0.045)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              gap: 7,
              height: 26,
              opacity: 0.75 - index * 0.08,
              padding: "0 8px",
              width: `${88 - index * 6}%`,
            }}
          >
            <div
              style={{
                background: index === 0 ? color : C.dim,
                height: 8,
                width: 8,
              }}
            />
            <div
              style={{
                background: "rgba(255,255,255,0.22)",
                height: 5,
                width: `${46 + index * 7}%`,
              }}
            />
          </div>
        ))}
      </div>
      <div
        style={{
          alignItems: "center",
          borderTop: "2px solid rgba(255,255,255,0.07)",
          color: C.muted,
          display: "flex",
          fontFamily: BODY_FONT,
          fontSize: 19,
          justifyContent: "space-between",
          padding: "8px 12px",
        }}
      >
        <span>{title}</span>
        <span style={{ color, fontFamily: PIXEL_FONT, fontSize: 9 }}>
          {count}
        </span>
      </div>
      {collapse > 0 ? (
        <div
          style={{
            alignItems: "center",
            background: `rgba(30,6,14,${collapse * 0.82})`,
            color: C.red,
            display: "flex",
            flexDirection: "column",
            fontFamily: PIXEL_FONT,
            fontSize: 12,
            gap: 8,
            inset: 0,
            justifyContent: "center",
            position: "absolute",
          }}
        >
          <PixelIcon color={C.red} name="warning" size={32} />
          SIGNED OUT
        </div>
      ) : null}
    </div>
  );
};

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const heading = pop({ frame, fps, delay: 6, damping: 18 });
  const windows = [
    {
      at: 18,
      x: 170,
      y: 300,
      w: 520,
      h: 330,
      rotate: -4,
      collapseAt: 118,
      title: "Acme Cloud",
      domain: "app.acme.co",
      count: "SIGNED IN",
      color: "#6366f1",
    },
    {
      at: 34,
      x: 790,
      y: 258,
      w: 540,
      h: 342,
      rotate: 2.5,
      collapseAt: 158,
      title: "Docs",
      domain: "docs.acme.co",
      count: "SIGNED IN",
      color: "#0ea5e9",
    },
    {
      at: 50,
      x: 1430,
      y: 386,
      w: 350,
      h: 300,
      rotate: -2,
      collapseAt: 198,
      title: "Linear",
      domain: "linear.app",
      count: "SIGNED IN",
      color: "#10b981",
    },
  ];
  const lost = interpolate(frame, [190, 220], [0, 1], clamp);
  const shake = frame > 195 && frame < 235 ? Math.sin(frame * 2.6) * 7 : 0;

  return (
    <SceneShell
      caption="One account per browser. Endless sign-ins."
      captionAccent={C.red}
      tone="danger"
    >
      <div style={{ left: 140, position: "absolute", top: 74 }}>
        <SceneHeading
          accent={C.red}
          kicker="THE LOGIN LOOP"
          progress={heading}
          style={{ transform: `translateX(${shake}px)` }}
        >
          Logout. Login.
          <br />
          <span style={{ color: C.red }}>Repeat.</span>
        </SceneHeading>
      </div>

      <div
        style={{
          display: "flex",
          gap: 14,
          position: "absolute",
          right: 140,
          top: 96,
        }}
      >
        <PixelChip color={C.red}>1 browser</PixelChip>
        <PixelChip color={C.amber}>3 accounts</PixelChip>
      </div>

      {windows.map((window) => {
        const progress = pop({ frame, fps, delay: window.at, damping: 14 });
        const collapse = interpolate(
          frame,
          [window.collapseAt, window.collapseAt + 22],
          [0, 1],
          clamp,
        );
        return (
          <MiniWindow
            collapse={collapse}
            color={window.color}
            count={window.count}
            domain={window.domain}
            key={window.title}
            progress={progress}
            rotate={window.rotate}
            style={{
              height: window.h,
              left: window.x,
              top: window.y,
              width: window.w,
            }}
            title={window.title}
          />
        );
      })}

      <div
        style={{
          alignItems: "flex-end",
          bottom: 110,
          display: "flex",
          gap: 18,
          left: 140,
          opacity: lost,
          position: "absolute",
          transform: `translateY(${(1 - lost) * 24}px)`,
        }}
      >
        <StatCallout color={C.red} label="ACCOUNTS" value="01" />
        <StatCallout color={C.red} label="SAVED LOGINS" value="00" />
        <StatCallout color={C.amber} label="RELOGINS" value="∞" />
      </div>

      <div
        style={{
          bottom: 120,
          color: C.red,
          fontFamily: PIXEL_FONT,
          fontSize: 34,
          opacity: lost,
          position: "absolute",
          right: 150,
          textAlign: "right",
          textShadow: `5px 5px 0 ${C.ink}`,
        }}
      >
        <div
          style={{
            color: C.cream,
            fontFamily: BODY_FONT,
            fontSize: 34,
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          You switch accounts.
        </div>
        You start over.
      </div>

      <div
        style={{
          bottom: 176,
          left: 180,
          position: "absolute",
          opacity: slideUp({ frame, fps, delay: 70 }).opacity * 0.7,
        }}
      >
        <PixelIcon color={C.dim} name="mouse" size={40} />
      </div>
      <div
        style={{
          bottom: 140,
          left: 120,
          position: "absolute",
          display: "flex",
          gap: 6,
          opacity: 0.6,
        }}
      >
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            style={{
              background: index < 4 ? C.red : "rgba(255,92,103,0.18)",
              height: 12,
              width: 22,
            }}
          />
        ))}
      </div>
    </SceneShell>
  );
};
