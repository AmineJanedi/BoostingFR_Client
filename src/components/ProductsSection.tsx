import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, CheckCircle, Package, Star } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: React.ReactNode;
}

const PRODUCTS: Product[] = [
  {
    id: 'pochette_nfc',
    name: 'Pochette de carte visite',
    price: 15,
    description: 'Une pochette premium pour protéger et transporter vos cartes de visite technologiques avec élégance.',
    icon: <Package className="w-8 h-8 text-gray-900" />
  },
  {
    id: 'cadre_review',
    name: 'Cadre de Google Review',
    price: 39,
    description: 'Cadre connecté sans contact (NFC + QR Code) pour inciter vos clients à laisser un avis instantanément.',
    icon: <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
  }
];

export default function ProductsSection() {
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
      setSelectedProduct(null); // Ferme le formulaire
    } catch (error: any) {
      console.error(error);
      toast.error("Erreur lors de la validation de la commande.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="Produit" className="py-20 bg-gray-50 min-h-screen flex flex-col justify-center scroll-mt-10">
      <div className="max-w-5xl mx-auto px-6 w-full">
        
        {/* Titre de la section */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
            Accessoires Connectés
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 font-serif">
            Optimisez votre écosystème
          </h2>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            Des outils haut de gamme pensés pour compléter vos cartes de networking.
          </p>
        </div>

        {/* Grille des Produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PRODUCTS.map((product) => (
            <div 
              key={product.id}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {product.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.description}</p>
              </div>
              
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-50">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">Prix unique</p>
                  <p className="text-3xl font-black text-gray-900">{product.price} <span className="text-sm font-medium">€ TTC</span></p>
                </div>
                <button
                  onClick={() => handleOpenForm(product)}
                  className="bg-gray-900 hover:bg-black text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <ShoppingBag size={16} /> Commander
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Formulaire Modal (Apparaît au clic sur Commander) */}
        <AnimatePresence>
          {selectedProduct && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-100 relative my-auto"
              >
                {/* Fermeture */}
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute right-4 top-4 p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X size={18} />
                </button>

                {/* En-tête du formulaire */}
                <div className="mb-6 pr-6">
                  <p className="text-xs font-bold uppercase text-blue-600 tracking-wider">Finaliser la commande</p>
                  <h4 className="text-lg font-bold text-gray-900 mt-1">{selectedProduct.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">Montant total : <span className="font-bold text-gray-900">{(selectedProduct.price * quantity).toFixed(2)} €</span></p>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  {/* Sélecteur de Quantité */}
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

                  {/* Nom complet */}
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

                  {/* Téléphone */}
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

                  {/* Adresse */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase block mb-1.5">Adresse de livraison</label>
                    <textarea 
                      name="address" 
                      required 
                      rows={2}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="12 Avenue des Champs-Élysées" 
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all resize-none"
                    />
                  </div>

                  {/* Code ZIP */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase block mb-1.5">Code ZIP / Postal</label>
                    <input 
                      type="text" 
                      name="zipCode" 
                      required 
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="75008" 
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
                    />
                  </div>

                  {/* Bouton validation */}
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full mt-2 bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                  >
                    {submitting ? "Traitement..." : "Confirmer ma commande"}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}