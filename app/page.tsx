import dynamic from 'next/dynamic';
import { InteractiveBackground } from "@/components/InteractiveBackground";
import { LandingHeader } from "@/components/LandingHeader";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { AboutSection } from "@/components/AboutSection";
import { InstallationSection } from "@/components/InstallationSection";
import { ImplementationSection } from "@/components/ImplementationSection";
import { Footer } from "@/components/Footer";

const HeroGraph = dynamic(() => import("@/components/HeroGraph").then(mod => mod.HeroGraph), { ssr: false });

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      <InteractiveBackground />
      <LandingHeader />
      <HeroGraph />
      <div className="px-6 w-full flex flex-col items-center">
        <HeroSection />
        <FeaturesSection />
      </div>

      <div className="w-full relative py-20">
        <div className="absolute inset-0 bg-primary/5 blur-[150px] -z-10" />
        <AboutSection />
      </div>

      <div className="w-full relative py-20 border-t border-white/5 bg-white/[0.01]">
        <InstallationSection />
      </div>

      <div className="w-full relative py-20 border-t border-white/5">
        <ImplementationSection />
      </div>
      <Footer />
    </div>
  );
}
