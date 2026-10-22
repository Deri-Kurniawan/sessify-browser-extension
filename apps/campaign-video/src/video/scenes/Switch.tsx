import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, cursorPath, pop, typewriter } from "../anim";
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

const SECOND_TIMESTAMP = "Oct 22, 2026, 14:48:31";

export const Switch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const open = pop({ frame, fps, delay: 0, damping: 16 });
  const reopen = pop({ frame, fps, delay: 176, damping: 14, stiffness: 190 });
  const close = interpolate(frame, [86, 96], [1, 0], clamp);
  const popupOpacity =
    frame < 96 ? Math.min(1, open) * close : frame < 176 ? 0 : reopen;

  const plusPress = interpolate(frame, [32, 40, 48], [0, 1, 0], clamp);
  const continuePress = interpolate(frame, [72, 80, 88], [0, 1, 0], clamp);
  const savePress = interpolate(frame, [198, 206, 214], [0, 1, 0], clamp);
  const infoPress = interpolate(frame, [244, 252, 260], [0, 1, 0], clamp);
  const updatePress = interpolate(frame, [322, 330, 338], [0, 1, 0], clamp);

  const plusDialogIn = pop({ frame, fps, delay: 46, damping: 16 });
  const plusDialogOut = interpolate(frame, [84, 94], [1, 0], clamp);
  const plusDialog = frame < 84 ? Math.min(1, plusDialogIn) : plusDialogOut;

  const detailIn = pop({ frame, fps, delay: 258, damping: 16 });
  const detailOut = interpolate(frame, [338, 348], [1, 0], clamp);
  const detailProgress = frame < 338 ? Math.min(1, detailIn) : detailOut;

  const secondIn = pop({ frame, fps, delay: 216, damping: 13, stiffness: 190 });
  const renamed = frame >= 332;
  const loginEmail = typewriter("second@acme.co", frame, 104, 148);
  const titleValue =
    frame < 274
      ? SECOND_TIMESTAMP
      : typewriter("Second account", frame, 274, 316);

  const pageMode =
    frame < 96
      ? "main"
      : frame < 176
        ? "login"
        : frame < 372
          ? "second"
          : frame < 412
            ? "main"
            : "second";
  const activeId: "main" | "second" | null =
    frame < 88
      ? "main"
      : frame < 216
        ? null
        : frame < 372
          ? "second"
          : frame < 412
            ? "main"
            : "second";

  const secondSession = {
    ...SECOND_SESSION,
    title: renamed ? "Second account" : SECOND_TIMESTAMP,
  };

  const flash = Math.max(
    interpolate(frame, [86, 92, 100], [0, 0.95, 0], clamp),
    interpolate(frame, [372, 378, 386], [0, 0.7, 0], clamp),
    interpolate(frame, [412, 418, 426], [0, 0.7, 0], clamp),
  );

  const cursor = cursorPath(frame, [
    { at: 0, x: 1580, y: 900 },
    { at: 20, x: 1655, y: 258 },
    { at: 36, x: 1655, y: 258 },
    { at: 64, x: 1680, y: 650 },
    { at: 76, x: 1680, y: 650 },
    { at: 104, x: 960, y: 560 },
    { at: 150, x: 960, y: 691 },
    { at: 164, x: 960, y: 691 },
    { at: 178, x: 1712, y: 111 },
    { at: 190, x: 1712, y: 258 },
    { at: 202, x: 1712, y: 258 },
    { at: 230, x: 1634, y: 558 },
    { at: 248, x: 1634, y: 558 },
    { at: 284, x: 1660, y: 500 },
    { at: 320, x: 1660, y: 500 },
    { at: 350, x: 1510, y: 440 },
    { at: 368, x: 1510, y: 440 },
    { at: 390, x: 1510, y: 558 },
    { at: 408, x: 1510, y: 558 },
    { at: 470, x: 1510, y: 558 },
  ]);
  const clickFrames = [40, 80, 164, 180, 206, 252, 330, 372, 412];
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
        frame < 46
          ? "One site can hold more than one account."
          : frame < 96
            ? "Continue clears the current session and reloads."
            : frame < 176
              ? "Sign in to the second account."
              : frame < 258
                ? "Save the second account as its own session."
                : frame < 352
                  ? "Name it. Both accounts stay in this domain list."
                  : frame < 412
                    ? "Click a card to restore that account."
                    : "Reloaded as the second account."
      }
      captionAccent={C.lime}
      tone="dusk"
    >
      <BrowserFrame
        activeTab="Acme Cloud"
        extensionBadge={frame >= 216 ? 2 : 1}
        highlightExtension={interpolate(
          frame,
          [168, 178, 190],
          [0, 1, 0],
          clamp,
        )}
        page={
          <>
            <AcmePage
              email={loginEmail}
              loginPress={interpolate(frame, [156, 164, 172], [0, 1, 0], clamp)}
              mode={pageMode}
            />
            <div
              style={{
                background: "#fff",
                inset: 0,
                opacity: flash,
                pointerEvents: "none",
                position: "absolute",
              }}
            />
          </>
        }
        style={{ left: STAGE.browser.x, top: STAGE.browser.y }}
      />

      <div
        style={{
          left: STAGE.popup.x,
          opacity: popupOpacity,
          position: "absolute",
          top: STAGE.popup.y,
          transform: `translateY(${(1 - popupOpacity) * 14}px)`,
          zIndex: 100,
        }}
      >
        <PopupShell scale={1.3}>
          <PopupTopBar plusPress={plusPress} savePress={savePress} />
          <PopupBody>
            <SaveNewSessionButton />
            <SessionCard active={activeId === "main"} session={MAIN_SESSION} />
            {frame >= 216 ? (
              <div
                style={{
                  opacity: Math.min(1, secondIn * 1.8),
                  transform: `translateY(${(1 - secondIn) * -10}px) scale(${0.97 + secondIn * 0.03})`,
                }}
              >
                <SessionCard
                  active={activeId === "second"}
                  infoPress={infoPress}
                  session={secondSession}
                />
              </div>
            ) : null}
          </PopupBody>
          <PopupNav />
          {plusDialog > 0.01 ? (
            <ConfirmDialog
              confirmLabel="Continue"
              description="Have you saved your current session? We will clear your current session's tabs."
              pressed={continuePress > 0.35 ? "confirm" : null}
              progress={plusDialog}
              title="Create a new session?"
            />
          ) : null}
          {detailProgress > 0.01 ? (
            <DetailDialog
              expanded={null}
              pressed={updatePress > 0.5 ? "update" : null}
              progress={detailProgress}
              session={{ ...secondSession, title: titleValue }}
              titleValue={titleValue}
            />
          ) : null}
        </PopupShell>
      </div>

      <div
        style={{
          background: "rgba(8,11,22,0.9)",
          border: `3px solid ${C.cyan}`,
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
          STEP 02
        </div>
        <div
          style={{
            color: C.cream,
            fontFamily: BODY_FONT,
            fontSize: 27,
            letterSpacing: 0.6,
          }}
        >
          Clear, sign in, save
        </div>
        <div style={{ color: C.cyan, fontFamily: PIXEL_FONT, fontSize: 9 }}>
          + → CLEAR → LOGIN → SAVE
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
