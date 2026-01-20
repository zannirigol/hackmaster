import { motion } from "framer-motion";
import { FileText, Video, Users, Clock, Award, Headphones } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Vídeo-Aulas HD",
    description: "Conteúdo gravado em alta definição com exemplos práticos",
  },
  {
    icon: FileText,
    title: "Documentos Exclusivos",
    description: "PDFs, cheatsheets e materiais de apoio detalhados",
  },
  {
    icon: Users,
    title: "Comunidade Ativa",
    description: "Acesso ao Discord exclusivo com outros hackers",
  },
  {
    icon: Clock,
    title: "Acesso Vitalício",
    description: "Uma vez aluno, para sempre. Sem mensalidades",
  },
  {
    icon: Award,
    title: "Certificação",
    description: "Certificado reconhecido ao concluir o curso",
  },
  {
    icon: Headphones,
    title: "Suporte Dedicado",
    description: "Tire suas dúvidas diretamente com instrutores",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-mono text-primary uppercase tracking-widest mb-4 block">
            // O QUE VOCÊ RECEBE
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-mono mb-4">
            BENEFÍCIOS <span className="text-primary text-glow">EXCLUSIVOS</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4 p-6 rounded-lg bg-card/50 border border-border hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-mono font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
