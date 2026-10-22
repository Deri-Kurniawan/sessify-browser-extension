import "./index.css";
import { Composition } from "remotion";
import { SessifyVideo, TOTAL_DURATION } from "./video/SessifyVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      component={SessifyVideo}
      durationInFrames={TOTAL_DURATION}
      fps={30}
      height={1080}
      id="SessifyIntro"
      width={1920}
    />
  );
};
