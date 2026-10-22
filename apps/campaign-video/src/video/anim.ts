import { Easing, interpolate, spring } from "remotion";

export const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const fade = (
  frame: number,
  start: number,
  duration: number,
  endFrame?: number,
  endDuration = duration,
) => {
  const inValue = interpolate(frame, [start, start + duration], [0, 1], clamp);
  if (endFrame === undefined) {
    return inValue;
  }
  const outValue = interpolate(
    frame,
    [endFrame - endDuration, endFrame],
    [1, 0],
    clamp,
  );
  return Math.min(inValue, outValue);
};

export const pop = ({
  frame,
  fps,
  delay = 0,
  damping = 13,
  stiffness = 180,
  mass = 0.7,
}: {
  frame: number;
  fps: number;
  delay?: number;
  damping?: number;
  stiffness?: number;
  mass?: number;
}) => {
  return spring({
    frame: frame - delay,
    fps,
    config: { damping, stiffness, mass },
  });
};

export const slideUp = ({
  frame,
  fps,
  delay = 0,
  distance = 40,
  damping = 16,
  stiffness = 160,
}: {
  frame: number;
  fps: number;
  delay?: number;
  distance?: number;
  damping?: number;
  stiffness?: number;
}) => {
  const value = pop({ frame, fps, delay, damping, stiffness });
  return {
    opacity: Math.min(1, value * 1.6),
    translate: `0px ${(1 - value) * distance}px`,
  };
};

export const typewriter = (
  text: string,
  frame: number,
  start: number,
  end: number,
) => {
  const progress = interpolate(frame, [start, end], [0, 1], clamp);
  return text.slice(0, Math.floor(text.length * progress));
};

export const cursorPath = (
  frame: number,
  points: { at: number; x: number; y: number }[],
) => {
  if (points.length === 0) {
    return { x: 0, y: 0 };
  }
  if (frame <= points[0].at) {
    return { x: points[0].x, y: points[0].y };
  }
  for (let index = 0; index < points.length - 1; index++) {
    const from = points[index];
    const to = points[index + 1];
    if (frame >= from.at && frame <= to.at) {
      const progress = interpolate(frame, [from.at, to.at], [0, 1], {
        ...clamp,
        easing: Easing.inOut(Easing.cubic),
      });
      return {
        x: from.x + (to.x - from.x) * progress,
        y: from.y + (to.y - from.y) * progress,
      };
    }
  }
  const last = points.at(-1);
  if (!last) {
    return { x: 0, y: 0 };
  }
  return { x: last.x, y: last.y };
};
