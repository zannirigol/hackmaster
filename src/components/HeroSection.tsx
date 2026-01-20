import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Terminal, Lock } from "lucide-react";
import GlitchText from "./GlitchText";
import TerminalWindow from "./TerminalWindow";

const HeroSection = () => {
  const terminalLines = [
    "Iniciando protocolo de acesso...",
    "Carregando módulos de segurança...",
    "Conectando ao servidor oculto...",
    "Acesso LIBERADO. Bem-vindo, Hacker.",
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
                Curso Avançado
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-mono mb-6 leading-tight">
              <GlitchText text="HACKMASTER" className="text-glow text-primary" />
              <br />
              <span className="text-foreground">PRO 2024</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Domine as técnicas avançadas de segurança cibernética. 
              <span className="text-primary font-semibold"> +50 horas</span> de conteúdo, 
              documentos exclusivos e acesso vitalício.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="group">
                <Lock className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                Acessar Agora
              </Button>
              <Button variant="outline" size="lg">
                <Terminal className="w-4 h-4 mr-2" />
                Ver Conteúdo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: "2.5K+", label: "Alunos" },
                { value: "50h+", label: "Conteúdo" },
                { value: "100%", label: "Online" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold font-mono text-primary text-glow">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right content - Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <TerminalWindow lines={terminalLines} className="animate-float" />
          </motion.div>
        </div>
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 scanline pointer-events-none" />
    </section>
  );
};

export default HeroSection;
