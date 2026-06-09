import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Fonctionnement', href: '#how-it-works' },
    { name: 'Service', href: '#service' },
    
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link 
          to="/"   
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 group"
        >
          {/* Ajout de overflow-hidden pour masquer ce qui dépasse des arrondis */}
          <div className="w-10 h-10 bg-primary rounded-xl overflow-hidden flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            <img
              src="/logozoomed.png"
              alt="Boosting.fr Logo"
              className="w-full h-full object-cover" 
            />
          </div>
          <span className="text-2xl font-bold tracking-tight font-serif">boosting.fr</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="#create"
            className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:scale-105 transition-all shadow-lg shadow-primary/20"
          >
            Créer ma carte
          </a>
        </nav>

        <button 
          className="md:hidden text-gray-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 md:hidden shadow-xl"
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-lg font-medium text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#create"
              className="bg-primary text-white px-6 py-4 rounded-xl text-center font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Créer ma carte
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;