import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import CardForm from '../components/CardForm';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Zap, Shield, Smartphone, RefreshCw } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: "Partage Instantané",
      description: "Un simple tap suffit pour partager vos coordonnées. Pas d'application requise pour votre interlocuteur."
    },
    {
      icon: RefreshCw,
      title: "Mises à jour illimitées",
      description: "Changez de numéro ou de poste ? Mettez à jour vos informations en ligne instantanément sans réimprimer."
    },
    {
      icon: Shield,
      title: "Sécurité & Contrôle",
      description: "Vous décidez quelles informations partager. Désactivez votre carte à tout moment en cas de perte."
    },
    {
      icon: Smartphone,
      title: "Compatible iOS & Android",
      description: "Fonctionne avec tous les smartphones modernes équipés de la technologie NFC."
    }
  ];

  return (
    <section id="products" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold mb-4">Pourquoi choisir Boosting.fr ?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Nous combinons design haut de gamme et technologie de pointe pour vous offrir l'outil de networking ultime.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl bg-white border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shadow-sm mb-6">
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        
        {/* 1. Comment ça marche ? */}
        <section id="how-it-works" className="py-20 bg-gray-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-12">
                  Comment ça marche ?
                </h2>
                
                <div className="space-y-10">
                  {[
                    { step: "01", title: "Configurez votre profil", desc: "Remplissez le formulaire avec vos coordonnées et liens sociaux." },
                    { step: "02", title: "Validation par nos experts", desc: "Notre équipe vérifie vos données et optimise le design de votre carte." },
                    { step: "03", title: "Réception & Activation", desc: "Recevez votre carte physique et commencez à networker intelligemment." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 items-start">
                      {/* Numéro blanc opaque uni */}
                      <span className="text-4xl font-serif font-bold text-white shrink-0 select-none">
                        {item.step}
                      </span>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative justify-self-center lg:justify-self-end w-full max-w-md lg:max-w-none">
                <img 
                  src="/boostingex.png" 
                  alt="NFC Tap" 
                  className="rounded-3xl shadow-2xl transform -rotate-3 max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Le Formulaire de commande */}
        <CardForm />

        {/* 3. Pourquoi choisir Boosting */}
        <Features />
      </main>
      <Footer />
    </div>
  );
}