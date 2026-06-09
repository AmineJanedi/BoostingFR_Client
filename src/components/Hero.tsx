import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-24 pb-12 lg:pt-36 lg:pb-20 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-sm font-bold mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Nouvelle Génération de Networking
          </div>
          
          {/* Hauteur de ligne équilibrée et marges réduites */}
          <h1 className="text-4xl sm:text-5xl lg:text-4xl font-serif font-bold leading-[1.25] mb-4">
            Votre réseau mérite une <span className="text-primary ">meilleure première impression.</span> 
          </h1>
          
          <p className="text-lg text-gray-600 mb-6 max-w-xl leading-relaxed">
            Passez au digital avec les cartes de visite QR Code de Boosting.fr. Partagez vos coordonnées, réseaux sociaux et liens en un seul geste.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <a 
              href="#create" 
              className="bg-primary text-white px-6 py-3.5 rounded-full font-bold text-base flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
            >
              Personnaliser ma carte <ArrowRight size={18} />
            </a>
            <a 
              href="#how-it-works" 
              className="bg-white border border-gray-200 text-gray-900 px-6 py-3.5 rounded-full font-bold text-base flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
            >
              Voir comment ça marche
            </a>
          </div>

          <div className="flex flex-wrap gap-5">
            {['Sans abonnement', 'Écologique', 'Mise à jour illimitée'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <CheckCircle2 size={16} className="text-primary" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative justify-self-center lg:justify-self-end w-full max-w-lg lg:max-w-none"
        >
          <div className="relative z-10 aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
            <img 
              src="/carte.png" 
              alt="QR Code Business Card" 
    className="w-4/4 h-auto object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
              <p className="text-xl font-serif font-bold">Design Minimaliste</p>
              <p className="text-sm opacity-80">Finition Premium & Technologie Intégrée</p>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-10" />
          <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;