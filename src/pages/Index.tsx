import { useState, useEffect } from "react";
import { AnimatedBackground } from "@/components/login/AnimatedBackground";
import { FloatingPanels } from "@/components/login/FloatingPanels";
import { LoginForm } from "@/components/login/LoginForm";
import { ThemeToggle } from "@/components/login/ThemeToggle";

const Index = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden transition-colors duration-500">
      <AnimatedBackground />
      <FloatingPanels />

      <div className="relative z-10 min-h-screen flex items-center px-6 md:px-12 lg:px-20">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Form area - offset left for asymmetry */}
            <div className="lg:col-span-5 lg:col-start-2">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>

      <ThemeToggle isDark={isDark} toggle={() => setIsDark(!isDark)} />
    </div>
  );
};

export default Index;
