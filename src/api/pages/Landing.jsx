import React from "react";
import SiteHeader from "@/components/colmeia/SiteHeader";
import SiteFooter from "@/components/colmeia/SiteFooter";
import Hero from "@/components/colmeia/Hero";
import TrustStrip from "@/components/colmeia/TrustStrip";
import ProblemSection from "@/components/colmeia/ProblemSection";
import HowItWorks from "@/components/colmeia/HowItWorks";
import AudienceSection from "@/components/colmeia/AudienceSection";
import PrivacySection from "@/components/colmeia/PrivacySection";
import ExampleSection from "@/components/colmeia/ExampleSection";
import NetworkStory from "@/components/colmeia/NetworkStory";
import FinalCTA from "@/components/colmeia/FinalCTA";

export default function Landing() {
  return (
    <div className="cm-surface cm-font min-h-screen">
      <SiteHeader />
      <Hero />
      <TrustStrip />
      <ProblemSection />
      <HowItWorks />
      <AudienceSection />
      <PrivacySection />
      <ExampleSection />
      <NetworkStory />
      <FinalCTA />
      <SiteFooter />
    </div>
  );
}