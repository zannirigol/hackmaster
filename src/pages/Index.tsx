import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ModulesSection from "@/components/ModulesSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import MatrixRain from "@/components/MatrixRain";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <MatrixRain />
      <Header />
      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <ModulesSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
