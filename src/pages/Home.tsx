import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import CardForm from '../components/CardForm';
import Footer from '../components/Footer'; 
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, Smartphone, RefreshCw, ShoppingBag, X } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';

// Structure de données pour les produits dérivés
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageSrc: string; // Ajout du champ pour l'image
}

const PRODUCTS: Product[] = [
  {
    id: 'pochette_nfc',
    name: 'Pochette de carte visite',
    price: 15,
    description: 'Une pochette premium pour protéger et transporter vos cartes de visite technologiques avec élégance.',
    imageSrc: '/pochette.jpg' // Votre image
  },
  {
    id: 'cadre_review',
    name: 'Cadre de Google Review',
    price: 39,
    description: 'Cadre connecté sans contact (NFC + QR Code) pour inciter vos clients à laisser un avis instantanément.',
    imageSrc: '/googlereview.jpg' // Votre image
  }
];

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
      description: "Fonctionne avec tous les smartphones modernes équipés de la technologie QR Code."
    }
  ];

  return (
    <section id="service" className="py-24 bg-gray-50">
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    zipCode: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleOpenForm = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setFormData({ name: '', phone: '', address: '', zipCode: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setSubmitting(true);
    const totalPrice = selectedProduct.price * quantity;

    try {
      const { error } = await supabase
        .from('product_orders')
        .insert([
          {
            product_name: selectedProduct.name,
            price_unit: selectedProduct.price,
            quantity: quantity,
            total_price: totalPrice,
            customer_name: formData.name,
            phone: formData.phone,
            address: formData.address,
            zip_code: formData.zipCode,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast.success(`Votre commande de ${selectedProduct.name} a été enregistrée !`);
      setSelectedProduct(null);
    } catch (error: any) {
      console.error(error);
      toast.error("Erreur lors de la validation de la commande.");
    } finally {
      setSubmitting(false);
    }
  };

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
                  alt="QR Code Tap" 
                  className="rounded-3xl shadow-2xl transform -rotate-3 max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Le Formulaire de commande principal */}
        <CardForm />

        {/* 3. Section Produits Dérivés Additionnels */}
        <section id="Produit" className="py-24 bg-white scroll-mt-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-widest text-gray-400 uppercase bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                Accessoires Connectés
              </span>
              <h2 className="text-4xl font-serif font-bold mt-4">Nos Offres Complémentaires</h2>
              <p className="text-gray-500 mt-2 max-w-xl mx-auto">
                Des outils haut de gamme pensés pour propulser l'activité et l'impact visuel de votre entreprise.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {PRODUCTS.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between group overflow-hidden"
                >
                  {/* Zone Image Produit */}
                  <div className="w-full h-64 bg-gray-50 overflow-hidden relative flex items-center justify-center border-b border-gray-100">
                    <img 
                      src={product.imageSrc} 
                      alt={product.name} 
                      className="max-h-full max-w-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Contenu Texte */}
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-400 uppercase font-semibold">Prix</p>
                        <p className="text-3xl font-black text-gray-900">{product.price} <span className="text-sm font-medium">€ TTC</span></p>
                      </div>
                      <button
                        onClick={() => handleOpenForm(product)}
                        className="bg-gray-900 hover:bg-black text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-md"
                      >
                        <ShoppingBag size={16} /> Commander
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Modal de Commande Produit */}
        <AnimatePresence>
          {selectedProduct && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-100 relative my-auto"
              >
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute right-4 top-4 p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X size={18} />
                </button>

                <div className="mb-6 pr-6">
                  <p className="text-xs font-bold uppercase text-blue-600 tracking-wider">Formulaire de commande</p>
                  <h4 className="text-lg font-bold text-gray-900 mt-1">{selectedProduct.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">Montant global : <span className="font-bold text-gray-900">{(selectedProduct.price * quantity).toFixed(2)} €</span></p>
                </div>

                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase block mb-1.5">Quantité</label>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button" 
                        disabled={quantity <= 1}
                        onClick={() => setQuantity(q => q - 1)} 
                        className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        value={quantity} 
                        readOnly 
                        className="w-16 h-10 border border-gray-200 rounded-lg text-center font-bold text-gray-900 outline-none"
                      />
                      <button 
                        type="button" 
                        onClick={() => setQuantity(q => q + 1)} 
                        className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase block mb-1.5">Nom & Prénom</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Jean Dupont" 
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase block mb-1.5">Numéro de Téléphone</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      required 
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="06 12 34 56 78" 
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase block mb-1.5">Adresse de livraison</label>
                    <textarea 
                      name="address" 
                      required 
                      rows={2}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="12 Rue de la Paix" 
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase block mb-1.5">Code ZIP / Postal</label>
                    <input 
                      type="text" 
                      name="zipCode" 
                      required 
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="75002" 
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full mt-2 bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                  >
                    {submitting ? "Traitement en cours..." : "Confirmer ma commande"}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 4. Pourquoi choisir Boosting */}
        <Features />
      </main>
      <Footer />
    </div>
  );
}