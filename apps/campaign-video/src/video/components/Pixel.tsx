import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BODY_FONT, PIXEL_FONT } from "../fonts";
import { C, PIXEL_SHADOW } from "../theme";

const ICONS = {
  lock: [
    "................",
    "....11111111....",
    "...111....111...",
    "...111....111...",
    "...111....111...",
    "..111111111111..",
    "..111111111111..",
    "..111222222111..",
    "..111221122111..",
    "..111221122111..",
    "..111222222111..",
    "..111111111111..",
    "..111111111111..",
    "................",
    "................",
    "................",
  ],
  shield: [
    "................",
    "...1111111111...",
    "..111111111111..",
    "..111111111111..",
    "..111111111111..",
    "..111112211111..",
    "..111122221111..",
    "..111122221111..",
    "..111122221111..",
    "...1112222111...",
    "...1111221111...",
    "....11111111....",
    ".....111111.....",
    "......1111......",
    ".......11.......",
    "................",
  ],
  bolt: [
    "................",
    ".......1111.....",
    "......11111.....",
    ".....111111.....",
    "....111111......",
    "...111111.......",
    "..111111........",
    "..111111111111..",
    "........111111..",
    ".......111111...",
    "......111111....",
    ".....111111.....",
    "....111111......",
    "...1111.........",
    "..111...........",
    "................",
  ],
  cards: [
    "................",
    "...11111111111..",
    "...11111111111..",
    "...11111111111..",
    "..111111111111..",
    "..111111111111..",
    "..111111111111..",
    ".2222222222222..",
    ".2222222222222..",
    ".2222222222222..",
    "22222222222222..",
    "22222222222222..",
    "22222222222222..",
    "................",
    "................",
    "................",
  ],
  database: [
    "................",
    "...1111111111...",
    "..111111111111..",
    "..111222222111..",
    "..111111111111..",
    "..111222222111..",
    "..111111111111..",
    "..111222222111..",
    "..111111111111..",
    "..111222222111..",
    "..111111111111..",
    "...1111111111...",
    "....11111111....",
    "................",
    "................",
    "................",
  ],
  plug: [
    "................",
    "......1111......",
    "......1111......",
    "......1111......",
    "....11111111....",
    "...1111111111...",
    "..111111111111..",
    "..111111111111..",
    "..111111111111..",
    "...1111111111...",
    "....11111111....",
    "................",
    ".......11.......",
    ".......11.......",
    "................",
    "................",
  ],
  code: [
    "................",
    "..11........11..",
    ".11..........11.",
    "11............11",
    "................",
    ".....111111.....",
    "....11....11....",
    "...11......11...",
    "....11....11....",
    ".....111111.....",
    "................",
    "11............11",
    ".11..........11.",
    "..11........11..",
    "................",
    "................",
  ],
  star: [
    "................",
    ".......11.......",
    "......1111......",
    "......1111......",
    ".....111111.....",
    "1111111111111111",
    ".11111111111111.",
    "..111111111111..",
    "...1111111111...",
    "....11111111....",
    "...1111111111...",
    "..111111111111..",
    "..1111....1111..",
    ".111........111.",
    ".11..........11.",
    "................",
  ],
  download: [
    "................",
    ".......11.......",
    ".......11.......",
    ".......11.......",
    "...1111111111...",
    "...1111111111...",
    ".......11.......",
    ".......11.......",
    "................",
    "1111111111111111",
    "1111111111111111",
    "1111111111111111",
    "................",
    "................",
    "................",
    "................",
  ],
  users: [
    "................",
    "....111..111....",
    "...11111.11111..",
    "...11111.11111..",
    "...11111.11111..",
    "....111...111...",
    "................",
    "..111111.111111.",
    ".11111111111111.",
    ".11111111111111.",
    ".11111111111111.",
    ".11111111111111.",
    "..111111111111..",
    "...1111111111...",
    "................",
    "................",
  ],
  globe: [
    "................",
    ".....111111.....",
    "...1111111111...",
    "..111111111111..",
    ".11111.11.11111.",
    ".11111.11.11111.",
    "1111111111111111",
    "1111111111111111",
    "1111111111111111",
    "1111111111111111",
    ".11111.11.11111.",
    ".11111.11.11111.",
    "..111111111111..",
    "...1111111111...",
    ".....111111.....",
    "................",
  ],
  check: [
    "................",
    ".............11.",
    "............111.",
    "...........1111.",
    "..........1111..",
    ".........1111...",
    "..11....1111....",
    ".111...1111.....",
    ".1111.1111......",
    "..11111111......",
    "...111111.......",
    "....1111........",
    "................",
    "................",
    "................",
    "................",
  ],
  clock: [
    "................",
    "......1111......",
    "....11111111....",
    "...1111111111...",
    "..111111111111..",
    ".11111121111111.",
    ".11111121111111.",
    "1111111211111111",
    "1111111211111111",
    "1111111222221111",
    "1111111111111111",
    ".11111111111111.",
    ".11111111111111.",
    "..111111111111..",
    "....11111111....",
    "................",
  ],
  mouse: [
    "................",
    "......1111......",
    ".....111111.....",
    "....11111111....",
    "....11111111....",
    "....11222211....",
    "....11222211....",
    "....11111111....",
    "....11111111....",
    "....11111111....",
    "....11111111....",
    ".....111111.....",
    "......1111......",
    "................",
    "................",
    "................",
  ],
  keyboard: [
    "................",
    "................",
    "1111111111111111",
    "1111111111111111",
    "11.11.11.11.11.1",
    "1111111111111111",
    "11.11.11.11.11.1",
    "1111111111111111",
    "111111....111111",
    "111111....111111",
    "1111111111111111",
    "1111111111111111",
    "................",
    "................",
    "................",
    "................",
  ],
  sparkle: [
    "................",
    ".......11.......",
    ".......11.......",
    ".......11.......",
    "....11.11.11....",
    "....111111111...",
    ".....1111111....",
    "11...111111...11",
    "111..111111..111",
    ".....1111111....",
    "....111111111...",
    "....11.11.11....",
    ".......11.......",
    ".......11.......",
    ".......11.......",
    "................",
  ],
  plus: [
    "................",
    ".......11.......",
    ".......11.......",
    ".......11.......",
    ".......11.......",
    ".......11.......",
    "1111111111111111",
    "1111111111111111",
    "1111111111111111",
    ".......11.......",
    ".......11.......",
    ".......11.......",
    ".......11.......",
    ".......11.......",
    "................",
    "................",
  ],
  browser: [
    "................",
    "1111111111111111",
    "1111111111111111",
    "1122331111111111",
    "1111111111111111",
    "11............11",
    "11............11",
    "11............11",
    "11............11",
    "11............11",
    "11............11",
    "11............11",
    "11............11",
    "1111111111111111",
    "1111111111111111",
    "................",
  ],
  wifi: [
    "................",
    "................",
    "...1111111111...",
    "..111111111111..",
    ".111........111.",
    "111..........111",
    "....11111111....",
    "...1111111111...",
    "..111......111..",
    "......1111......",
    ".....111111.....",
    "......1111......",
    ".......11.......",
    "................",
    "................",
    "................",
  ],
  warning: [
    "................",
    ".......11.......",
    "......1111......",
    "......1111......",
    ".....111111.....",
    ".....112211.....",
    "....11122111....",
    "....11122111....",
    "...1111221111...",
    "...1111221111...",
    "..111112211111..",
    "..111111111111..",
    ".11111111111111.",
    ".11111111111111.",
    "................",
    "................",
  ],
} as const;

export type PixelIconName = keyof typeof ICONS;

export const PixelIcon: React.FC<{
  name: PixelIconName;
  size?: number;
  color?: string;
  color2?: string;
  color3?: string;
  style?: CSSProperties;
}> = ({
  name,
  size = 64,
  color = C.cyan,
  color2 = C.lime,
  color3 = C.pink,
  style,
}) => {
  const rows = ICONS[name];
  const cells: ReactNode[] = [];
  rows.forEach((row, y) => {
    row.split("").forEach((cell, x) => {
      if (cell === ".") {
        return;
      }
      const fill = cell === "2" ? color2 : cell === "3" ? color3 : color;
      cells.push(
        <rect fill={fill} height={1} key={`${x}-${y}`} width={1} x={x} y={y} />,
      );
    });
  });
  return (
    <svg
      aria-hidden
      height={size}
      shapeRendering="crispEdges"
      style={{ display: "block", ...style }}
      viewBox="0 0 16 16"
      width={size}
    >
      <title>Sessify pixel icon</title>
      {cells}
    </svg>
  );
};

export const PixelLogo: React.FC<{
  size?: number;
  style?: CSSProperties;
}> = ({ size = 96, style }) => {
  return (
    <div
      style={{
        alignItems: "center",
        background: `linear-gradient(135deg, ${C.blue} 0%, #2b5fe0 60%, #5f4aff 100%)`,
        border: `${Math.max(3, size * 0.055)}px solid ${C.ink}`,
        borderRadius: size * 0.16,
        boxShadow: `${size * 0.09}px ${size * 0.09}px 0 rgba(0,0,0,0.5)`,
        display: "flex",
        height: size,
        justifyContent: "center",
        position: "relative",
        width: size,
        ...style,
      }}
    >
      <div
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.13) 0 2px, transparent 2px 6px), repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0 2px, transparent 2px 6px)",
          inset: size * 0.08,
          position: "absolute",
        }}
      />
      <span
        style={{
          color: "#fff",
          fontFamily: PIXEL_FONT,
          fontSize: size * 0.42,
          lineHeight: 1,
          position: "relative",
          textShadow: `${size * 0.035}px ${size * 0.035}px 0 ${C.ink}`,
        }}
      >
        S
      </span>
      <div
        style={{
          background: C.lime,
          border: `${Math.max(1, size * 0.018)}px solid ${C.ink}`,
          bottom: size * 0.11,
          height: size * 0.075,
          position: "absolute",
          right: size * 0.11,
          width: size * 0.075,
        }}
      />
    </div>
  );
};

export const PixelPanel: React.FC<{
  children: ReactNode;
  style?: CSSProperties;
  accent?: string;
  noPadding?: boolean;
}> = ({ children, style, accent = C.cyan, noPadding = false }) => {
  return (
    <div
      style={{
        background: C.panel,
        border: `4px solid ${C.ink}`,
        boxShadow: PIXEL_SHADOW,
        padding: noPadding ? 0 : 24,
        position: "relative",
        ...style,
      }}
    >
      <div
        style={{
          background: accent,
          height: 4,
          left: 0,
          position: "absolute",
          right: 0,
          top: 0,
        }}
      />
      {children}
    </div>
  );
};

export const PixelChip: React.FC<{
  children: ReactNode;
  color?: string;
  filled?: boolean;
  style?: CSSProperties;
}> = ({ children, color = C.cyan, filled = false, style }) => {
  return (
    <div
      style={{
        alignItems: "center",
        background: filled ? color : "rgba(10,13,24,0.72)",
        border: `3px solid ${filled ? C.ink : color}`,
        boxShadow: "4px 4px 0 rgba(0,0,0,0.35)",
        color: filled ? C.ink : color,
        display: "inline-flex",
        fontFamily: BODY_FONT,
        fontSize: 26,
        gap: 8,
        letterSpacing: 1,
        lineHeight: 1,
        padding: "8px 12px 6px",
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const PixelButton: React.FC<{
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
  pressed?: boolean;
}> = ({ children, color = C.lime, style, pressed = false }) => {
  return (
    <div
      style={{
        background: color,
        border: `4px solid ${C.ink}`,
        boxShadow: pressed
          ? "2px 2px 0 rgba(0,0,0,0.5)"
          : "6px 6px 0 rgba(0,0,0,0.5)",
        color: C.ink,
        fontFamily: PIXEL_FONT,
        fontSize: 20,
        lineHeight: 1.5,
        padding: "16px 22px",
        textAlign: "center",
        translate: pressed ? "4px 4px" : "0px 0px",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const CornerFrame: React.FC<{ inset?: number; color?: string }> = ({
  inset = 26,
  color = "rgba(100,230,255,0.35)",
}) => {
  const corner = (position: CSSProperties): CSSProperties => ({
    borderColor: color,
    borderStyle: "solid",
    borderWidth: 0,
    height: 30,
    position: "absolute",
    width: 30,
    ...position,
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 50 }}>
      <div
        style={corner({
          borderLeftWidth: 4,
          borderTopWidth: 4,
          left: inset,
          top: inset,
        })}
      />
      <div
        style={corner({
          borderRightWidth: 4,
          borderTopWidth: 4,
          right: inset,
          top: inset,
        })}
      />
      <div
        style={corner({
          borderBottomWidth: 4,
          borderLeftWidth: 4,
          bottom: inset,
          left: inset,
        })}
      />
      <div
        style={corner({
          borderBottomWidth: 4,
          borderRightWidth: 4,
          bottom: inset,
          right: inset,
        })}
      />
    </AbsoluteFill>
  );
};

export const Scanlines: React.FC = () => {
  const frame = useCurrentFrame();
  const flicker = 0.015 + Math.abs(Math.sin(frame * 0.71)) * 0.012;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 60 }}>
      <AbsoluteFill
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.17) 0px, rgba(0,0,0,0.17) 2px, transparent 2px, transparent 4px)",
          mixBlendMode: "multiply",
          opacity: 0.75,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(0,0,0,0.42) 100%)",
        }}
      />
      <AbsoluteFill style={{ background: "#dff7ff", opacity: flicker }} />
    </AbsoluteFill>
  );
};

const STAR_SEED = Array.from({ length: 54 }, (_, index) => {
  const x = (index * 37.13 + 11) % 100;
  const y = (index * 61.7 + 7) % 100;
  const size = 2 + (index % 3) * 2;
  const speed = 0.08 + (index % 5) * 0.025;
  return { x, y, size, speed };
});

export const PixelBackground: React.FC<{
  tone?: "blue" | "dusk" | "danger" | "gold";
  glowX?: string;
  glowY?: string;
}> = ({ tone = "blue", glowX = "72%", glowY = "18%" }) => {
  const frame = useCurrentFrame();
  const glow =
    tone === "danger"
      ? "rgba(255,92,103,0.24)"
      : tone === "dusk"
        ? "rgba(177,140,255,0.25)"
        : tone === "gold"
          ? "rgba(255,209,102,0.18)"
          : "rgba(79,140,255,0.23)";
  const base =
    tone === "danger"
      ? ["#120811", "#1b0b1a", "#260d21"]
      : tone === "dusk"
        ? ["#0b0818", "#15102b", "#1e163d"]
        : tone === "gold"
          ? ["#141006", "#211909", "#2c210d"]
          : ["#070b17", "#0d1326", "#121a33"];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${base[0]} 0%, ${base[1]} 55%, ${base[2]} 100%)`,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${glowX} ${glowY}, ${glow} 0%, transparent 56%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.grid} 2px, transparent 2px), linear-gradient(90deg, ${C.grid} 2px, transparent 2px)`,
          backgroundSize: "64px 64px",
          opacity: 0.9,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.gridStrong} 2px, transparent 2px), linear-gradient(90deg, ${C.gridStrong} 2px, transparent 2px)`,
          backgroundSize: "256px 256px",
          opacity: 0.55,
        }}
      />
      {STAR_SEED.map((star, index) => (
        <div
          key={index}
          style={{
            background:
              index % 7 === 0 ? C.cyan : index % 5 === 0 ? C.pink : C.white,
            height: star.size,
            left: `${star.x}%`,
            opacity: 0.3 + (index % 4) * 0.12,
            position: "absolute",
            top: `${star.y}%`,
            translate: `0px ${Math.sin(frame * star.speed + index) * 8}px`,
            width: star.size,
          }}
        />
      ))}
      <div
        style={{
          background:
            "repeating-linear-gradient(90deg, rgba(100,230,255,0.045) 0 2px, transparent 2px 128px)",
          bottom: 0,
          height: 250,
          left: 0,
          opacity: 0.6,
          position: "absolute",
          right: 0,
        }}
      />
    </AbsoluteFill>
  );
};

export const Caption: React.FC<{
  children: ReactNode;
  accent?: string;
  progress?: number;
  style?: CSSProperties;
}> = ({ children, accent = C.cyan, progress = 1, style }) => {
  return (
    <div
      style={{
        alignItems: "center",
        background: "rgba(5,7,17,0.82)",
        border: `3px solid ${C.ink}`,
        bottom: 28,
        boxShadow: "6px 6px 0 rgba(0,0,0,0.4)",
        display: "flex",
        gap: 14,
        left: "50%",
        opacity: progress,
        padding: "10px 18px 8px",
        position: "absolute",
        translate: `-50% ${(1 - progress) * 14}px`,
        zIndex: 120,
        ...style,
      }}
    >
      <div style={{ background: accent, height: 26, width: 6 }} />
      <div
        style={{
          color: C.cream,
          fontFamily: BODY_FONT,
          fontSize: 32,
          letterSpacing: 1.2,
          lineHeight: 0.95,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const PixelCursor: React.FC<{
  x: number;
  y: number;
  pressed?: boolean;
  ripple?: number;
  zIndex?: number;
}> = ({ x, y, pressed = false, ripple = 0, zIndex = 200 }) => {
  return (
    <div
      style={{
        left: x,
        position: "absolute",
        top: y,
        transform: `scale(${pressed ? 0.85 : 1})`,
        transformOrigin: "2px 2px",
        zIndex,
      }}
    >
      {ripple > 0 ? (
        <div
          style={{
            border: `4px solid ${C.cyan}`,
            height: 54,
            left: -20,
            opacity: Math.max(0, 1 - ripple) * 0.85,
            position: "absolute",
            top: -20,
            transform: `scale(${0.4 + ripple * 1.4})`,
            width: 54,
          }}
        />
      ) : null}
      <svg
        height={42}
        shapeRendering="crispEdges"
        style={{ filter: "drop-shadow(4px 4px 0 rgba(0,0,0,0.45))" }}
        viewBox="0 0 14 18"
        width={33}
      >
        <title>Sessify cursor</title>
        <path
          d="M1 1 L1 15 L4.4 11.6 L6.3 17 L9 15.9 L7.1 10.7 L12 10.7 Z"
          fill={C.white}
          stroke={C.ink}
          strokeWidth={1.6}
        />
        <path
          d="M3 4 L3 10.5 L5 8.6 L6.4 12.6 L7.4 12.2 L6 8.3 L9 8.3 Z"
          fill={C.ink}
          opacity={0.22}
        />
      </svg>
    </div>
  );
};

export const LabelBar: React.FC<{
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
}> = ({ children, color = C.cyan, style }) => {
  return (
    <div
      style={{
        alignItems: "center",
        color,
        display: "flex",
        fontFamily: PIXEL_FONT,
        fontSize: 15,
        gap: 10,
        letterSpacing: 0.5,
        lineHeight: 1.6,
        ...style,
      }}
    >
      <div style={{ background: color, height: 3, width: 18 }} />
      <span>{children}</span>
    </div>
  );
};
