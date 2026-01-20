import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, Shield } from "lucide-react";
import GlitchText from "./GlitchText";

const plans = [
  {
    name: "INICIANTE",
    icon: Shield,
    price: "197",
    originalPrice: "397",
    features: [
      "Acesso a 4 módulos básicos",
      "20+ horas de conteúdo",
      "Certificado de conclusão",
      "Comunidade Discord",
      "Suporte por email",
    ],
    popular: false,
  },
  {
    name: "PRO",
    icon: Zap,
    price: "397",
    originalPrice: "797",
    features: [
      "Acesso a todos os 8 módulos",
      "50+ horas de conteúdo",
      "Documentos exclusivos",
      "Laboratórios virtuais",
      "Mentoria em grupo",
      "Certificado avançado",
      "Atualizações vitalícias",
    ],
    popular: true,
  },
  {
    name: "ELITE",
    icon: Crown,
    price: "997",
    originalPrice: "1997",
    features: [
      "Tudo do plano PRO",
      "Mentoria individual",
      "Acesso a CTFs exclusivos",
      "Networking com experts",
      "Projetos reais",
      "Suporte prioritário",
      "Bônus: Toolkit hacker",
    ],
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section className="py-24 relative" id="pricing">
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-mono text-primary uppercase tracking-widest mb-4 block">
            // INVESTIMENTO
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-mono mb-4">
            ESCOLHA SEU <GlitchText text="NÍVEL" className="text-primary" />
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Oferta especial por tempo limitado. Garanta seu acesso com desconto exclusivo.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={`relative ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-mono font-bold">
                    MAIS POPULAR
                  </span>
                </div>
              )}
              
              <div 
                className={`h-full bg-card border rounded-xl p-8 transition-all duration-300 ${
                  plan.popular 
                    ? "border-primary box-glow" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    plan.popular ? "bg-primary text-primary-foreground" : "bg-primary/10"
                  }`}>
                    <plan.icon className={`w-5 h-5 ${plan.popular ? "" : "text-primary"}`} />
                  </div>
                  <h3 className="font-mono font-bold text-xl">{plan.name}</h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-muted-foreground">R$</span>
                    <span className={`text-4xl font-bold font-mono ${plan.popular ? "text-primary text-glow" : ""}`}>
                      {plan.price}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground line-through">
                    R$ {plan.originalPrice}
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  {plan.popular ? "Garantir Acesso" : "Escolher Plano"}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
