import { motion } from "framer-motion";

interface GlitchTextProps {
  text: string;
  className?: string;
}

const GlitchText = ({ text, className = "" }: GlitchTextProps) => {
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      whileHover={{ scale: 1.02 }}
    >
      <span className="relative z-10">{text}</span>
      <span
        className="absolute inset-0 text-neon-cyan opacity-70"
        style={{ clipPath: "inset(45% 0 40% 0)", transform: "translate(-2px, 0)" }}
        aria-hidden
      >
        {text}
      </span>
      <span
        className="absolute inset-0 text-neon-magenta opacity-70"
        style={{ clipPath: "inset(20% 0 60% 0)", transform: "translate(2px, 0)" }}
        aria-hidden
      >
        {text}
      </span>
    </motion.span>
  );
};

export default GlitchText;
