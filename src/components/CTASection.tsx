import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-sm font-mono text-primary">Vagas Limitadas</span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-mono mb-6">
            PRONTO PARA SE TORNAR UM{" "}
            <span className="text-primary text-glow">HACKER PROFISSIONAL</span>?
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Junte-se a mais de 2.500 alunos que já transformaram suas carreiras. 
            Oferta válida apenas enquanto houver vagas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 group">
              <Lock className="w-5 h-5 mr-2" />
              Garantir Minha Vaga
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Pagamento 100% seguro • Garantia de 7 dias • Suporte imediato
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
