import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const PIXEL_FONT = "SessifyPixel";
export const BODY_FONT = "SessifyBody";
export const UI_FONT = "SessifyUI";

loadFont({
  family: PIXEL_FONT,
  url: staticFile("fonts/PressStart2P.woff2"),
  weight: "400",
  format: "woff2",
});

loadFont({
  family: BODY_FONT,
  url: staticFile("fonts/VT323.woff2"),
  weight: "400",
  format: "woff2",
});

loadFont({
  family: UI_FONT,
  url: staticFile("fonts/Inter.woff2"),
  weight: "100 900",
  format: "woff2",
});
