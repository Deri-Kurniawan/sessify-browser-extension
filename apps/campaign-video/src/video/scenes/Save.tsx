import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, cursorPath, pop, typewriter } from "../anim";
import { BrowserFrame, STAGE } from "../components/BrowserFrame";
import { PixelCursor } from "../components/Pixel";
import { SceneShell } from "../components/SceneChrome";
import { BODY_FONT, PIXEL_FONT } from "../fonts";
import { C } from "../theme";
import { AcmePage } from "../ui/AcmePage";
import {
  DetailDialog,
  EmptyState,
  MAIN_SESSION,
  PopupBody,
  PopupNav,
  PopupShell,
  PopupTopBar,
  SaveNewSessionButton,
  SessionCard,
} from "../ui/SessifyPopup";

const TIMESTAMP = "Oct 22, 2026, 14:32:08";

export const Save: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const open = pop({ frame, fps, delay: 8, damping: 15, stiffness: 170 });
  const savePress = interpolate(frame, [62, 70, 78], [0, 1, 0], clamp);
  const infoPress = interpolate(frame, [132, 140, 148], [0, 1, 0], clamp);
  const updatePress = interpolate(frame, [216, 224, 232], [0, 1, 0], clamp);
  const cardIn = pop({ frame, fps, delay: 76, damping: 13, stiffness: 190 });
  const detailIn = pop({ frame, fps, delay: 146, damping: 16 });
  const detailOut = interpolate(frame, [228, 240], [1, 0], clamp);
  const detailProgress = frame < 228 ? Math.min(1, detailIn) : detailOut;
  const renamed = frame >= 226;
  const titleValue =
    frame < 160 ? TIMESTAMP : typewriter("Main account", frame, 160, 204);

  const session = {
    ...MAIN_SESSION,
    title: renamed ? "Main account" : TIMESTAMP,
  };

  const cursor = cursorPath(frame, [
    { at: 0, x: 1580, y: 910 },
    { at: 38, x: 1712, y: 258 },
    { at: 58, x: 1712, y: 258 },
    { at: 102, x: 1634, y: 440 },
    { at: 130, x: 1634, y: 440 },
    { at: 174, x: 1660, y: 500 },
    { at: 212, x: 1660, y: 500 },
    { at: 268, x: 1510, y: 560 },
    { at: 360, x: 1510, y: 560 },
  ]);
  const clickFrames = [70, 138, 224];
  const pressed = clickFrames.some((value) => Math.abs(frame - value) <= 4);
  const ripple = Math.max(
    ...clickFrames.map((value) => {
      const t = (frame - value) / 18;
      return t > 0 && t < 1 ? 1 - t : 0;
    }),
  );

  return (
    <SceneShell
      caption={
        frame < 84
          ? "Already signed in. Save the session."
          : frame < 146
            ? "Saved instantly. No naming dialog."
            : frame < 240
              ? "Open details to give it a clear name."
              : "Main account saved, named, and active."
      }
      tone="blue"
    >
      <BrowserFrame
        activeTab="Acme Cloud"
        extensionBadge={frame >= 84 ? 1 : 0}
        highlightExtension={interpolate(frame, [52, 66, 82], [0, 1, 0], clamp)}
        page={<AcmePage mode="main" />}
        style={{ left: STAGE.browser.x, top: STAGE.browser.y }}
      />

      <div
        style={{
          left: STAGE.popup.x,
          opacity: Math.min(1, open * 1.5),
          position: "absolute",
          top: STAGE.popup.y,
          transform: `translateY(${(1 - open) * -14}px) scale(${0.97 + open * 0.03})`,
          transformOrigin: "top right",
          zIndex: 100,
        }}
      >
        <PopupShell scale={1.3}>
          <PopupTopBar savePress={savePress} />
          <PopupBody>
            {frame >= 84 ? (
              <>
                <SaveNewSessionButton />
                <div
                  style={{
                    opacity: Math.min(1, cardIn * 1.8),
                    transform: `translateY(${(1 - cardIn) * -10}px) scale(${0.97 + cardIn * 0.03})`,
                  }}
                >
                  <SessionCard active infoPress={infoPress} session={session} />
                </div>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  gridColumn: "1 / -1",
                }}
              >
                <EmptyState />
              </div>
            )}
          </PopupBody>
          <PopupNav />
          {detailProgress > 0.01 ? (
            <DetailDialog
              expanded={null}
              pressed={updatePress > 0.4 ? "update" : null}
              progress={detailProgress}
              session={{ ...session, title: titleValue }}
              titleValue={titleValue}
            />
          ) : null}
        </PopupShell>
      </div>

      <div
        style={{
          background: "rgba(8,11,22,0.9)",
          border: `3px solid ${C.lime}`,
          bottom: 126,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.4)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          left: 120,
          padding: "12px 16px",
          position: "absolute",
          zIndex: 80,
        }}
      >
        <div
          style={{
            color: C.dim,
            fontFamily: PIXEL_FONT,
            fontSize: 9,
            letterSpacing: 1,
          }}
        >
          STEP 01
        </div>
        <div
          style={{
            color: C.cream,
            fontFamily: BODY_FONT,
            fontSize: 27,
            letterSpacing: 0.6,
          }}
        >
          Save the main account
        </div>
        <div style={{ color: C.lime, fontFamily: PIXEL_FONT, fontSize: 9 }}>
          SIGNED IN → SAVE → RENAME
        </div>
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
