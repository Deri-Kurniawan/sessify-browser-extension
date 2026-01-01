import { GradientText } from "@/components/ui";

export function PrivacyHeader() {
  return (
    <div className="text-center">
      <h1 className="font-bold text-4xl tracking-tight md:text-5xl lg:text-6xl">
        Your Privacy is <GradientText>Our Priority</GradientText>
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
        Sessify is built with privacy by design. Your data stays on your device,
        and we never track, collect, or share your personal information.
      </p>
    </div>
  );
}
