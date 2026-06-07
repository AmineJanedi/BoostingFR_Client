import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-sm font-bold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Nouvelle Génération de Networking
          </div>
          <h1 className="text-5xl lg:text-7xl font-serif font-bold leading-[1.1] mb-8">
            Votre réseau mérite une <span className="text-primary italic">meilleure</span> première impression.
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-xl leading-relaxed">
            Passez au digital avec les cartes de visite NFC de Boosting.fr. Partagez vos coordonnées, réseaux sociaux et liens en un seul geste.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <a 
              href="#create" 
              className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
            >
              Personnaliser ma carte <ArrowRight size={20} />
            </a>
            <a 
              href="#how-it-works" 
              className="bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
            >
              Voir comment ça marche
            </a>
          </div>

          <div className="flex flex-wrap gap-6">
            {['Sans abonnement', 'Écologique', 'Mise à jour illimitée'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <CheckCircle2 size={18} className="text-primary" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <img 
              src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=1200" 
              alt="NFC Business Card" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
              <p className="text-2xl font-serif font-bold">Design Minimaliste</p>
              <p className="opacity-80">Finition Premium & Technologie Intégrée</p>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl -z-10" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-primary/5 rounded-full blur-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;