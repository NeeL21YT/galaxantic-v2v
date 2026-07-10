/**
 * app/page.tsx
 *
 * Herizon Landing Page - Stage 1A
 *
 * Server Component: assembles all landing page sections.
 * Sections that require client interactivity are individually
 * marked "use client" and imported here as usual.
 */

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { CTASection } from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <>
      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main id="main-content">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
