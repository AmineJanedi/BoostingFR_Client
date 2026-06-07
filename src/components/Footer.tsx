import React from 'react';
import { CreditCard, Instagram, Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                <CreditCard size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tight font-serif">boosting.fr</span>
            </div>
            <p className="text-gray-500 leading-relaxed">
              L'agence leader en solutions de networking NFC en France. Nous transformons vos interactions professionnelles.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Produits</h4>
            <ul className="space-y-4 text-gray-500">
              <li><a href="#" className="hover:text-primary transition-colors">Cartes PVC Premium</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cartes en Métal</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cartes en Bois</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Solutions Entreprise</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Entreprise</h4>
            <ul className="space-y-4 text-gray-500">
              <li><a href="#" className="hover:text-primary transition-colors">À propos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Partenaires</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-gray-500">
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary" />
                contact@boosting.fr
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary" />
                +33 1 23 45 67 89
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-primary" />
                Paris, France
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2026 Boosting FR. Tous droits réservés.
          </p>
          <div className="flex gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-primary transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-primary transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-primary transition-colors">CGV</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;