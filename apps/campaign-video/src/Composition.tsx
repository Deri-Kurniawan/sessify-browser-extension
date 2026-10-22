import { type CalculateMetadataFunction, Composition } from "remotion";

type Props = Record<string, unknown>;

const calculateMetadata: CalculateMetadataFunction<Props> = () => {
  return {};
};

export const MyComposition = () => {
  return (
    <Composition
      calculateMetadata={calculateMetadata}
      component={MyComponent}
      durationInFrames={60}
      fps={30}
      height={720}
      id="MyComp"
      width={1280}
    />
  );
};

export const MyComponent: React.FC<Props> = () => {
  return null;
};
