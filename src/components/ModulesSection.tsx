import { motion } from "framer-motion";
import { 
  Terminal, 
  Shield, 
  Database, 
  Globe, 
  Lock, 
  Code,
  Wifi,
  Server
} from "lucide-react";
import GlitchText from "./GlitchText";

const modules = [
  {
    icon: Terminal,
    title: "Fundamentos Linux",
    lessons: 12,
    duration: "6h",
    description: "Domine o terminal e comandos essenciais",
  },
  {
    icon: Globe,
    title: "Web Hacking",
    lessons: 18,
    duration: "10h",
    description: "SQL Injection, XSS, CSRF e mais",
  },
  {
    icon: Wifi,
    title: "Network Security",
    lessons: 15,
    duration: "8h",
    description: "Análise de tráfego e exploração de redes",
  },
  {
    icon: Lock,
    title: "Criptografia",
    lessons: 10,
    duration: "5h",
    description: "Algoritmos e quebra de criptografia",
  },
  {
    icon: Code,
    title: "Python para Hackers",
    lessons: 14,
    duration: "7h",
    description: "Scripts e automação de ataques",
  },
  {
    icon: Database,
    title: "Database Exploitation",
    lessons: 8,
    duration: "4h",
    description: "Extração e manipulação de dados",
  },
  {
    icon: Server,
    title: "Engenharia Reversa",
    lessons: 12,
    duration: "6h",
    description: "Análise de malware e binários",
  },
  {
    icon: Shield,
    title: "Red Team Ops",
    lessons: 16,
    duration: "9h",
    description: "Operações ofensivas avançadas",
  },
];

const ModulesSection = () => {
  return (
    <section className="py-24 relative" id="modules">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-mono text-primary uppercase tracking-widest mb-4 block">
            // MÓDULOS
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-mono mb-4">
            <GlitchText text="CONTEÚDO" className="text-primary" /> COMPLETO
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            8 módulos estruturados do básico ao avançado, com projetos práticos e laboratórios virtuais.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
              <div className="bg-card border border-border group-hover:border-primary/50 rounded-lg p-6 h-full transition-all duration-300 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <module.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground block">{module.lessons} aulas</span>
                    <span className="text-xs font-mono text-primary">{module.duration}</span>
                  </div>
                </div>
                <h3 className="font-mono font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                  {module.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {module.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
