import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { BODY_FONT, PIXEL_FONT } from "../fonts";
import { C } from "../theme";
import { Caption, CornerFrame, PixelBackground } from "./Pixel";

export const SceneShell: React.FC<{
  children: ReactNode;
  tone?: "blue" | "dusk" | "danger" | "gold";
  caption?: string;
  captionAccent?: string;
  captionProgress?: number;
  style?: CSSProperties;
}> = ({
  children,
  tone = "blue",
  caption,
  captionAccent = C.cyan,
  captionProgress = 1,
  style,
}) => {
  return (
    <AbsoluteFill style={style}>
      <PixelBackground tone={tone} />
      {children}
      <CornerFrame />
      {caption ? (
        <Caption accent={captionAccent} progress={captionProgress}>
          {caption}
        </Caption>
      ) : null}
    </AbsoluteFill>
  );
};

export const SceneHeading: React.FC<{
  kicker?: string;
  children: ReactNode;
  accent?: string;
  progress?: number;
  align?: "left" | "center";
  style?: CSSProperties;
}> = ({
  kicker,
  children,
  accent = C.cyan,
  progress = 1,
  align = "left",
  style,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        opacity: progress,
        textAlign: align,
        translate: `0px ${(1 - progress) * 22}px`,
        ...style,
      }}
    >
      {kicker ? (
        <div
          style={{
            color: accent,
            fontFamily: PIXEL_FONT,
            fontSize: 12,
            letterSpacing: 1,
            lineHeight: 1.6,
          }}
        >
          ◆ {kicker}
        </div>
      ) : null}
      <div
        style={{
          color: C.cream,
          fontFamily: PIXEL_FONT,
          fontSize: 34,
          letterSpacing: -0.5,
          lineHeight: 1.55,
          textShadow: `4px 4px 0 ${C.ink}`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const SectionLabel: React.FC<{
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
}> = ({ children, color = C.cyan, style }) => (
  <div
    style={{
      alignItems: "center",
      color,
      display: "flex",
      fontFamily: BODY_FONT,
      fontSize: 24,
      gap: 10,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      ...style,
    }}
  >
    <span
      style={{
        background: color,
        display: "inline-block",
        height: 3,
        width: 28,
      }}
    />
    {children}
  </div>
);

export const StatCallout: React.FC<{
  label: string;
  value: string;
  color?: string;
  style?: CSSProperties;
}> = ({ label, value, color = C.cyan, style }) => (
  <div
    style={{
      background: "rgba(8,11,22,0.82)",
      border: `3px solid ${C.ink}`,
      boxShadow: "6px 6px 0 rgba(0,0,0,0.4)",
      minWidth: 180,
      padding: "14px 18px",
      ...style,
    }}
  >
    <div
      style={{
        color: C.dim,
        fontFamily: BODY_FONT,
        fontSize: 22,
        letterSpacing: 1.5,
      }}
    >
      {label}
    </div>
    <div
      style={{
        color,
        fontFamily: PIXEL_FONT,
        fontSize: 28,
        lineHeight: 1.5,
        textShadow: `3px 3px 0 ${C.ink}`,
      }}
    >
      {value}
    </div>
  </div>
);
