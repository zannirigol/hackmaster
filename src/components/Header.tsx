import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Terminal, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      navigate("/auth");
    }
  };


  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <Terminal className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-mono font-bold text-xl">
              <span className="text-primary">HACK</span>MASTER
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#modules" className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono">
              Módulos
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono">
              Preços
            </a>
            <Button size="sm" onClick={handleAuthClick}>
              {user ? (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </>
              ) : (
                "Acessar"
              )}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-border/50"
          >
            <div className="flex flex-col gap-4">
              <a 
                href="#modules" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
                onClick={() => setIsMenuOpen(false)}
              >
                Módulos
              </a>
              <a 
                href="#pricing" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
                onClick={() => setIsMenuOpen(false)}
              >
                Preços
              </a>
              <Button size="sm" className="w-fit" onClick={handleAuthClick}>
                {user ? (
                  <>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </>
                ) : (
                  "Acessar"
                )}
              </Button>
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
