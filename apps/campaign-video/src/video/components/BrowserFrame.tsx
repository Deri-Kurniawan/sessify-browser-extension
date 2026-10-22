import type { CSSProperties, ReactNode } from "react";
import { Img, staticFile } from "remotion";
import { BODY_FONT, PIXEL_FONT } from "../fonts";
import { C } from "../theme";
import { PixelIcon } from "./Pixel";

export const STAGE = {
  browser: { x: 140, y: 80, w: 1640, h: 920 },
  titleBar: 62,
  tabStrip: 42,
  popup: { x: 1262, y: 214 },
  sidePanel: { width: 690, height: 816 },
} as const;

export type BrowserTab = {
  label: string;
  color?: string;
  active?: boolean;
};

export const BrowserFrame: React.FC<{
  children?: ReactNode;
  page?: ReactNode;
  sidePanel?: ReactNode;
  url?: string;
  style?: CSSProperties;
  contentStyle?: CSSProperties;
  highlightExtension?: number;
  extensionBadge?: number;
  activeTab?: string;
  tabs?: BrowserTab[];
}> = ({
  children,
  page,
  sidePanel,
  url = "https://app.acme.co/home",
  style,
  contentStyle,
  highlightExtension = 0,
  extensionBadge = 0,
  activeTab = "Acme Cloud",
  tabs,
}) => {
  const frame = style ?? {};
  const visibleTabs = tabs ?? [
    { label: activeTab, color: "#4f46e5", active: true },
  ];

  return (
    <div
      style={{
        background: "#0b1020",
        border: `6px solid ${C.ink}`,
        boxShadow:
          "14px 14px 0 rgba(0,0,0,0.55), 0 40px 100px rgba(0,0,0,0.55)",
        display: "flex",
        flexDirection: "column",
        height: STAGE.browser.h,
        overflow: "hidden",
        position: "absolute",
        width: STAGE.browser.w,
        ...frame,
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(180deg,#1a2444,#141c35)",
          borderBottom: `3px solid ${C.ink}`,
          display: "flex",
          flex: `0 0 ${STAGE.titleBar}px`,
          gap: 16,
          padding: "0 18px",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {[C.pink, C.amber, C.lime].map((color) => (
            <div
              key={color}
              style={{
                background: color,
                border: `3px solid ${C.ink}`,
                height: 15,
                width: 15,
              }}
            />
          ))}
        </div>
        <div style={{ alignItems: "center", display: "flex", flex: 1, gap: 8 }}>
          <div
            style={{
              alignItems: "center",
              background: "#0a1020",
              border: "2px solid #2c3a63",
              display: "flex",
              flex: 1,
              gap: 10,
              height: 38,
              padding: "0 12px",
            }}
          >
            <PixelIcon color={C.lime} name="lock" size={14} />
            <span
              style={{
                color: "#cdd8f5",
                fontFamily: BODY_FONT,
                fontSize: 26,
                letterSpacing: 0.5,
                lineHeight: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {url}
            </span>
            <span
              style={{
                color: C.dim,
                fontFamily: PIXEL_FONT,
                fontSize: 9,
                marginLeft: "auto",
              }}
            >
              HTTPS
            </span>
          </div>
          <div
            style={{
              alignItems: "center",
              background: highlightExtension > 0.1 ? "#233a2f" : "#0a1020",
              border: `2px solid ${highlightExtension > 0.1 ? C.lime : "#2c3a63"}`,
              display: "flex",
              height: 38,
              justifyContent: "center",
              position: "relative",
              transform: `scale(${1 + highlightExtension * 0.08})`,
              width: 38,
            }}
          >
            <Img
              src={staticFile("icons/sessify-32.png")}
              style={{ height: 25, imageRendering: "pixelated", width: 25 }}
            />
            {extensionBadge > 0 ? (
              <div
                style={{
                  alignItems: "center",
                  background: "#050505",
                  border: "2px solid #f8f5e9",
                  borderRadius: 999,
                  color: "#fff",
                  display: "flex",
                  fontFamily: BODY_FONT,
                  fontSize: 10,
                  fontWeight: 700,
                  height: 16,
                  justifyContent: "center",
                  minWidth: 16,
                  padding: "0 3px",
                  position: "absolute",
                  right: -6,
                  top: -6,
                }}
              >
                {extensionBadge}
              </div>
            ) : null}
          </div>
        </div>
        <PixelIcon color={C.amber} name="star" size={16} />
      </div>

      <div
        style={{
          alignItems: "flex-end",
          background: "#101830",
          borderBottom: `3px solid ${C.ink}`,
          display: "flex",
          flex: `0 0 ${STAGE.tabStrip}px`,
          gap: 6,
          padding: "0 12px",
        }}
      >
        {visibleTabs.map((tab) => (
          <div
            key={tab.label}
            style={{
              alignItems: "center",
              background: tab.active ? "#f4f6fb" : "#18213c",
              display: "flex",
              gap: 8,
              height: 34,
              maxWidth: 250,
              minWidth: 110,
              padding: "0 14px",
            }}
          >
            <div
              style={{
                alignItems: "center",
                background: tab.color ?? "#4f46e5",
                borderRadius: 3,
                color: "#fff",
                display: "flex",
                fontFamily: BODY_FONT,
                fontSize: 15,
                height: 18,
                justifyContent: "center",
                width: 18,
              }}
            >
              {(tab.label || "A").slice(0, 1).toUpperCase()}
            </div>
            <span
              style={{
                color: tab.active ? "#131a2e" : "#8d9ac2",
                fontFamily: BODY_FONT,
                fontSize: 18,
                lineHeight: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </span>
            <span
              style={{
                color: tab.active ? "#8a93a8" : "#56628b",
                fontSize: 13,
                marginLeft: "auto",
              }}
            >
              ×
            </span>
          </div>
        ))}
        <div
          style={{
            color: "#6e7ba6",
            fontFamily: BODY_FONT,
            fontSize: 22,
            padding: "0 4px 4px",
          }}
        >
          +
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <div
          style={{
            background: "#fbfbfc",
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            overflow: "hidden",
            position: "relative",
            ...contentStyle,
          }}
        >
          {page}
          {children}
        </div>
        {sidePanel ? (
          <div
            style={{
              background: "#0a1020",
              borderLeft: `6px solid ${C.ink}`,
              flex: `0 0 ${STAGE.sidePanel.width}px`,
              height: "100%",
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            {sidePanel}
          </div>
        ) : null}
      </div>
    </div>
  );
};
