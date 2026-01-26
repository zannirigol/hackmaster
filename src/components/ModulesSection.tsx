import { motion } from "framer-motion";
import { 
  Terminal, 
  Shield, 
  Database, 
  Globe, 
  Lock, 
  Code,
  Wifi,
  Server,
  BookOpen,
  Loader2
} from "lucide-react";
import GlitchText from "./GlitchText";
import { useModules } from "@/hooks/useModules";

// Mapeamento de ícones por nível
const levelIcons: Record<string, React.ElementType> = {
  beginner: Terminal,
  intermediate: Code,
  advanced: Shield,
};

// Ícones padrão para ciclar entre módulos
const defaultIcons = [Terminal, Globe, Wifi, Lock, Code, Database, Server, Shield];

const getLevelLabel = (level: string) => {
  const labels: Record<string, string> = {
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado',
  };
  return labels[level] || level;
};

const ModulesSection = () => {
  const { modules, loading, error } = useModules();

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
            {modules.length > 0 
              ? `${modules.length} módulos estruturados do básico ao avançado, com projetos práticos e laboratórios virtuais.`
              : 'Módulos estruturados do básico ao avançado, com projetos práticos e laboratórios virtuais.'
            }
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">Erro ao carregar módulos. Tente novamente.</p>
          </div>
        ) : modules.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum módulo disponível ainda.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, index) => {
              const IconComponent = defaultIcons[index % defaultIcons.length];
              const lessonCount = module.lessons.length;
              
              return (
                <motion.div
                  key={module.id}
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
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground block">
                          {lessonCount} {lessonCount === 1 ? 'aula' : 'aulas'}
                        </span>
                        <span className="text-xs font-mono text-primary">
                          {getLevelLabel(module.level)}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-mono font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {module.description || 'Conteúdo em desenvolvimento...'}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ModulesSection;
