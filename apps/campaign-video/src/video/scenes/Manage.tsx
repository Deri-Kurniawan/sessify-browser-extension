import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, cursorPath, pop } from "../anim";
import { BrowserFrame, STAGE } from "../components/BrowserFrame";
import { PixelCursor } from "../components/Pixel";
import { SceneShell } from "../components/SceneChrome";
import { BODY_FONT, PIXEL_FONT } from "../fonts";
import { C } from "../theme";
import { AcmePage } from "../ui/AcmePage";
import {
  ConfirmDialog,
  DetailDialog,
  MAIN_SESSION,
  PopupBody,
  PopupNav,
  PopupShell,
  PopupTopBar,
  SaveNewSessionButton,
  SECOND_SESSION,
  SessionCard,
} from "../ui/SessifyPopup";

export const Manage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const open = pop({ frame, fps, delay: 0, damping: 16 });
  const detailIn = pop({ frame, fps, delay: 54, damping: 16 });
  const detailOut = interpolate(frame, [270, 282], [1, 0], clamp);
  const detailProgress = frame < 270 ? Math.min(1, detailIn) : detailOut;

  const scroll = interpolate(
    frame,
    [110, 150, 220, 245],
    [0, 400, 400, 430],
    clamp,
  );
  const expanded = frame >= 190 ? "localStorage" : null;
  const deleting = interpolate(frame, [342, 358], [0, 1], clamp);
  const removed = frame >= 360;

  const confirmIn = pop({ frame, fps, delay: 312, damping: 16 });
  const confirmOut = interpolate(frame, [354, 364], [1, 0], clamp);
  const confirmProgress = frame < 354 ? Math.min(1, confirmIn) : confirmOut;
  const confirmPress = interpolate(frame, [336, 344, 352], [0, 1, 0], clamp);

  const cursor = cursorPath(frame, [
    { at: 0, x: 1600, y: 900 },
    { at: 24, x: 1634, y: 440 },
    { at: 40, x: 1634, y: 440 },
    { at: 120, x: 1510, y: 551 },
    { at: 186, x: 1510, y: 551 },
    { at: 236, x: 1600, y: 500 },
    { at: 258, x: 1702, y: 295 },
    { at: 266, x: 1702, y: 295 },
    { at: 292, x: 1691, y: 440 },
    { at: 300, x: 1691, y: 440 },
    { at: 326, x: 1660, y: 655 },
    { at: 340, x: 1660, y: 655 },
    { at: 410, x: 1520, y: 560 },
  ]);
  const clickFrames = [44, 190, 270, 304, 344];
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
        frame < 54
          ? "Open a session to inspect everything it stores."
          : frame < 110
            ? "Title, timestamps, domain details, stored data."
            : frame < 222
              ? "Expand storage to see the raw saved keys."
              : frame < 304
                ? "Close details, then delete the inactive account."
                : frame < 360
                  ? "Confirm. The active session stays untouched."
                  : "One account removed. The active session is safe."
      }
      captionAccent={frame < 304 ? C.amber : C.lime}
      tone="gold"
    >
      <BrowserFrame
        activeTab="Acme Cloud"
        extensionBadge={removed ? 1 : 2}
        page={<AcmePage mode="second" />}
        style={{ left: STAGE.browser.x, top: STAGE.browser.y }}
      />

      <div
        style={{
          left: STAGE.popup.x,
          opacity: open,
          position: "absolute",
          top: STAGE.popup.y,
          transform: `translateY(${(1 - open) * 14}px)`,
          zIndex: 100,
        }}
      >
        <PopupShell scale={1.3}>
          <PopupTopBar />
          <PopupBody>
            <SaveNewSessionButton />
            {removed ? null : (
              <SessionCard
                deleting={deleting}
                infoPress={interpolate(frame, [36, 44, 52], [0, 1, 0], clamp)}
                session={MAIN_SESSION}
                trashPress={interpolate(
                  frame,
                  [296, 304, 312],
                  [0, 1, 0],
                  clamp,
                )}
              />
            )}
            <SessionCard active session={SECOND_SESSION} />
          </PopupBody>
          <PopupNav />
          {detailProgress > 0.01 ? (
            <DetailDialog
              expanded={expanded}
              progress={detailProgress}
              scroll={scroll}
              session={MAIN_SESSION}
              titleValue={MAIN_SESSION.title}
            />
          ) : null}
          {confirmProgress > 0.01 ? (
            <ConfirmDialog
              confirmLabel="Delete"
              description="This action cannot be undone."
              destructive
              pressed={confirmPress > 0.4 ? "confirm" : null}
              progress={confirmProgress}
              title="Are you sure you want to delete this session?"
            />
          ) : null}
        </PopupShell>
      </div>

      <div
        style={{
          background: "rgba(8,11,22,0.9)",
          border: `3px solid ${C.amber}`,
          bottom: 126,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.4)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          left: 120,
          padding: "12px 16px",
          position: "absolute",
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
          STEP 03
        </div>
        <div
          style={{
            color: C.cream,
            fontFamily: BODY_FONT,
            fontSize: 27,
            letterSpacing: 0.6,
          }}
        >
          Inspect, then delete
        </div>
        <div style={{ color: C.amber, fontFamily: PIXEL_FONT, fontSize: 9 }}>
          DETAILS → STORAGE → DELETE
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
