import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, CheckCircle2, XCircle, Euro, ShieldAlert, LogOut, RefreshCw, ChevronDown, ChevronUp, Globe, Facebook, Instagram, Linkedin, Calendar, Image as ImageIcon, ExternalLink, FileText } from 'lucide-react';
import { toast } from 'react-toastify';

interface CardData {
  id: number;
  created_at: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  title: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  website: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  calendly: string;
  photoUrl: string | null;
  logoUrl: string | null;
  primaryColor: string;
  accentColor: string;
  paid_amount: number;
  remark?: string; // Ajouté pour correspondre au schéma de la base de données
}

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAdminAuth') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [confirmingCardId, setConfirmingCardId] = useState<number | null>(null);
  const [amountInput, setAmountInput] = useState<string>('45');

  useEffect(() => {
    if (isAuthenticated) {
      fetchCards();
    }
  }, [isAuthenticated]);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('nfc_cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCards(data || []);
    } catch (error: any) {
      toast.error("Erreur lors de la récupération");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('isAdminAuth', 'true');
      toast.success("Connexion réussie");
    } else {
      toast.error("Identifiants incorrects");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAdminAuth');
    toast.info("Déconnexion réussie");
  };

  const openConfirmModal = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmingCardId(id);
    setAmountInput('45');
  };

  const handleConfirmSubmit = async () => {
    if (!confirmingCardId) return;
    const finalAmount = parseFloat(amountInput) || 0;

    try {
      const { error } = await supabase
        .from('nfc_cards')
        .update({ 
          status: 'confirmed', 
          paid_amount: finalAmount
        })
        .eq('id', confirmingCardId);

      if (error) throw error;

      setCards(prev => prev.map(card => 
        card.id === confirmingCardId 
          ? { ...card, status: 'confirmed', paid_amount: finalAmount } 
          : card
      ));
      
      toast.success(`Client confirmé (${finalAmount} € enregistré)`);
      setConfirmingCardId(null);
    } catch (error: any) {
      console.error("Erreur de mise à jour Supabase :", error);
      toast.error(`Erreur : ${error.message || "Vérifiez vos politiques RLS ou contraintes SQL"}`);
    }
  };

  const handleCancelClient = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('nfc_cards')
        .update({ 
          status: 'cancelled',
          paid_amount: 0 
        })
        .eq('id', id);

      if (error) throw error;

      setCards(prev => prev.map(card => 
        card.id === id 
          ? { ...card, status: 'cancelled', paid_amount: 0 } 
          : card
      ));
      toast.info(`Demande marquée comme annulée.`);
    } catch (error: any) {
      console.error("Erreur d'annulation Supabase :", error);
      toast.error(`Erreur : ${error.message}`);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const totalClients = cards.length;
  const confirmedClients = cards.filter(c => c.status === 'confirmed').length;
  const cancelledClients = cards.filter(c => c.status === 'cancelled').length;
  const totalProfit = cards.reduce((sum, card) => sum + (Number(card.paid_amount) || 0), 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-gray-100">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4"><ShieldAlert size={32} /></div>
            <h2 className="text-2xl font-bold font-serif text-gray-800">Espace Administration</h2>
            <p className="text-gray-500 text-sm mt-1">Accès strictement restreint</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase block mb-2">Identifiant</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/20" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase block mb-2">Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/20" required />
            </div>
            <button type="submit" className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-black transition-all">Se connecter</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12 relative">
      
      {/* MODAL SAISIE MONTANT */}
      <AnimatePresence>
        {confirmingCardId && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmer la commande</h3>
              <p className="text-sm text-gray-500 mb-4">Veuillez indiquer le montant payé par le client pour cette carte NFC.</p>
              <div className="space-y-4">
                <div className="relative">
                  <input type="number" value={amountInput} onChange={(e) => setAmountInput(e.target.value)} className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 outline-none font-bold text-lg focus:ring-2 focus:ring-green-500/20" placeholder="0" min="0" />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">€</div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmingCardId(null)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all">Annuler</button>
                  <button onClick={handleConfirmSubmit} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all">Valider l'envoi</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold font-serif text-gray-900">Dashboard Boosting FR</h1>
            <p className="text-gray-500">Cliquez sur une ligne pour voir le détail des couleurs, visuels et réseaux.</p>
          </div>
          <div className="flex gap-3 items-center">
            <a href="https://boostingfr.netlify.app/" target="_blank" rel="noreferrer" className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-100 transition-all shadow-sm">
              <ExternalLink size={16} /> Atelier
            </a>
            <button onClick={fetchCards} className="p-3 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 shadow-sm">
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
            <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-100 shadow-sm">
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div><p className="text-sm font-medium text-gray-400 uppercase">Total Clients</p><p className="text-3xl font-bold text-gray-900 mt-1">{totalClients}</p></div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Users size={24} /></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div><p className="text-sm font-medium text-gray-400 uppercase">Confirmés</p><p className="text-3xl font-bold text-green-600 mt-1">{confirmedClients}</p></div>
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center"><CheckCircle2 size={24} /></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div><p className="text-sm font-medium text-gray-400 uppercase">Annulés</p><p className="text-3xl font-bold text-red-600 mt-1">{cancelledClients}</p></div>
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center"><XCircle size={24} /></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div><p className="text-sm font-medium text-gray-400 uppercase">Profit Cumulé</p><p className="text-3xl font-bold text-gray-900 mt-1">{totalProfit} €</p></div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><Euro size={24} /></div>
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6 w-10"></th>
                  <th className="py-4 px-6">Client & Entreprise</th>
                  <th className="py-4 px-6">Contact</th>
                  <th className="py-4 px-6">Montant Payé</th>
                  <th className="py-4 px-6">Statut</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
                ={loading ? (
                  <tr><td colSpan={6} className="py-10 text-center text-gray-400"><div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-2" />Chargement...</td></tr>
                ) : cards.length === 0 ? (
                  <tr><td colSpan={6} className="py-10 text-center text-gray-400">Aucune demande reçue.</td></tr>
                ) : (
                  cards.map((card) => {
                    const isExpanded = expandedCardId === card.id;
                    return (
                      <React.Fragment key={card.id}>
                        <tr onClick={() => toggleExpand(card.id)} className="hover:bg-gray-50/80 cursor-pointer transition-colors">
                          <td className="py-4 px-6 text-gray-400">{isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</td>
                          <td className="py-4 px-6">
                            <p className="font-bold text-gray-900">{card.name}</p>
                            <p className="text-xs text-gray-400">{card.title} @ <span className="font-medium text-gray-500">{card.company}</span></p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-mono text-xs">{card.email}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{card.phone}</p>
                          </td>
                          <td className="py-4 px-6 font-bold text-gray-800">
                            {card.status === 'confirmed' ? `${card.paid_amount || 0} €` : '—'}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              card.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              card.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {card.status === 'confirmed' && 'Confirmé'}
                              {card.status === 'cancelled' && 'Annulé'}
                              {card.status === 'pending' && 'En attente'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex justify-center gap-2">
                              <button onClick={(e) => openConfirmModal(card.id, e)} className="px-3 py-1.5 bg-green-600 text-white rounded-xl font-bold text-xs hover:bg-green-700 transition-all disabled:opacity-30" disabled={card.status === 'confirmed'}>Confirmer</button>
                              <button onClick={(e) => handleCancelClient(card.id, e)} className="px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-xs hover:bg-red-50 transition-all disabled:opacity-30" disabled={card.status === 'cancelled'}>Annuler</button>
                            </div>
                          </td>
                        </tr>

                        {/* Contenu Dépliant */}
                        <AnimatePresence>
                          {isExpanded && (
                            <tr className="bg-gray-50/50">
                              <td colSpan={6} className="p-0">
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-12 py-6 border-l-4 border-gray-900 overflow-hidden">
                                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6"> {/* Changement ici : grid-cols-4 au lieu de 3 */}
                                    
                                    {/* Fichiers Médias */}
                                    <div className="space-y-4">
                                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5"><ImageIcon size={14} /> Fichiers Médias</h4>
                                      <div className="flex gap-4">
                                        <div>
                                          <p className="text-xs text-gray-500 mb-1">Photo Profil :</p>
                                          {card.photoUrl ? <img src={card.photoUrl} alt="Profil" className="w-20 h-20 rounded-xl object-cover border border-gray-200 bg-white" /> : <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-400 border border-gray-200">Aucune</div>}
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500 mb-1">Logo Société :</p>
                                          {card.logoUrl ? <img src={card.logoUrl} alt="Logo" className="w-20 h-20 rounded-xl object-cover border border-gray-200 bg-white" /> : <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-400 border border-gray-200">Aucun</div>}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Identité Visuelle */}
                                    <div className="space-y-4">
                                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">🎨 Identité Visuelle</h4>
                                      <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-lg border border-gray-300" style={{ backgroundColor: card.primaryColor || '#1a1a1a' }} />
                                          <div><p className="text-xs text-gray-400">Couleur Primaire</p><p className="font-mono text-xs uppercase text-gray-700 font-bold">{card.primaryColor || '#1a1a1a'}</p></div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-lg border border-gray-300" style={{ backgroundColor: card.accentColor || '#ffffff' }} />
                                          <div><p className="text-xs text-gray-400">Couleur Accent</p><p className="font-mono text-xs uppercase text-gray-700 font-bold">{card.accentColor || '#ffffff'}</p></div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Liens soumis */}
                                    <div className="space-y-4">
                                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">🔗 Liens soumis</h4>
                                      <div className="space-y-2 text-xs">
                                        {card.website ? <a href={card.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline truncate"><Globe size={14} /> Site : {card.website}</a> : <p className="text-gray-400 flex items-center gap-2"><Globe size={14} /> Aucun site web</p>}
                                        {card.facebook && <a href={card.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-800 hover:underline truncate"><Facebook size={14} /> Facebook</a>}
                                        {card.instagram && <a href={card.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-pink-600 hover:underline truncate"><Instagram size={14} /> Instagram</a>}
                                        {card.linkedin && <a href={card.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-700 hover:underline truncate"><Linkedin size={14} /> LinkedIn</a>}
                                        {card.calendly && <a href={card.calendly} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-orange-600 hover:underline truncate"><Calendar size={14} /> Calendly</a>}
                                      </div>
                                    </div>

                                    {/* Section Remarque (Nouveau) */}
                                    <div className="space-y-4">
                                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5"><FileText size={14} /> Note / Remarque</h4>
                                      <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs text-gray-700 min-h-[80px] italic">
                                        {card.remark ? card.remark : "Aucune remarque ou consigne particulière laissée par le client."}
                                      </div>
                                    </div>

                                  </div>
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;