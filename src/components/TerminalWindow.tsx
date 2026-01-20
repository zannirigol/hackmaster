import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TerminalWindowProps {
  lines: string[];
  className?: string;
}

const TerminalWindow = ({ lines, className = "" }: TerminalWindowProps) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (currentLine >= lines.length) return;

    const line = lines[currentLine];
    
    if (currentChar < line.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          newLines[currentLine] = line.substring(0, currentChar + 1);
          return newLines;
        });
        setCurrentChar(c => c + 1);
      }, 30 + Math.random() * 30);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLine(l => l + 1);
        setCurrentChar(0);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [currentLine, currentChar, lines]);

  return (
    <motion.div
      className={`bg-terminal border border-primary/30 rounded-lg overflow-hidden border-glow ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 px-4 py-2 border-b border-primary/20 bg-muted/50">
        <div className="w-3 h-3 rounded-full bg-destructive" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-primary" />
        <span className="ml-2 text-xs text-muted-foreground font-mono">root@hackmaster:~</span>
      </div>
      <div className="p-4 font-mono text-sm text-foreground min-h-[200px]">
        {displayedLines.map((line, i) => (
          <div key={i} className="flex">
            <span className="text-primary mr-2">$</span>
            <span>{line}</span>
            {i === currentLine && <span className="animate-pulse ml-1">▊</span>}
          </div>
        ))}
        {currentLine < lines.length && displayedLines.length === currentLine && (
          <div className="flex">
            <span className="text-primary mr-2">$</span>
            <span className="animate-pulse">▊</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TerminalWindow;
