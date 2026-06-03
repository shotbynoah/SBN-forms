import OnboardingForm from "@/components/OnboardingForm";
import { WebGLShader } from "@/components/ui/web-gl-shader";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <WebGLShader />
      <div className="relative z-10 w-full max-w-2xl">
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#e87070" }}>
            SBN MEDIA LLC
          </p>
          <h1 className="text-3xl font-bold text-white">Website Onboarding</h1>
          <p className="mt-2 text-white/60">
            Help us understand your vision so we can build the perfect website for you.
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  );
}
