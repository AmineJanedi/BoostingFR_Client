import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { User, Briefcase, Mail, Phone, Globe, Facebook, Instagram, Calendar, Image as ImageIcon, Palette, Send, CheckCircle, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '../supabaseClient';

const schema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  title: z.string().min(2, "Le poste est requis"),
  company: z.string().min(2, "L'entreprise est requise"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  website: z.string().url("L'URL doit commencer par http:// ou https://").or(z.string().length(0)),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  calendly: z.string().optional(),
  photoFile: z.any().optional(),
  logoFile: z.any().optional(),
  primaryColor: z.string().default("#1a1a1a"),
  accentColor: z.string().default("#ffffff"),
});

type FormData = z.infer<typeof schema>;

const CardForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      primaryColor: "#1a1a1a",
      accentColor: "#ffffff",
      website: "",
      facebook: "",
      instagram: "",
      calendly: ""
    }
  });

  const primaryColor = watch('primaryColor');
  const accentColor = watch('accentColor');
  const watchedPhoto = watch('photoFile');
  const watchedLogo = watch('logoFile');

  useEffect(() => {
    if (watchedPhoto && watchedPhoto.length > 0) {
      const file = watchedPhoto[0];
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPhotoPreview(null);
    }
  }, [watchedPhoto]);

  useEffect(() => {
    if (watchedLogo && watchedLogo.length > 0) {
      const file = watchedLogo[0];
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setLogoPreview(null);
    }
  }, [watchedLogo]);

  const onSubmit = async (data: FormData) => {
    try {
      let photoUrl = null;
      let logoUrl = null;

      const uploadFile = async (fileList: any, prefix: string) => {
        if (!fileList || fileList.length === 0) return null;
        const file = fileList[0];
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${prefix}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('card-assets')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('card-assets')
          .getPublicUrl(fileName);

        return urlData.publicUrl;
      };

      // 1. Envoi des fichiers aux buckets de stockage
      if (data.photoFile && data.photoFile.length > 0) {
        photoUrl = await uploadFile(data.photoFile, 'photo');
      }
      if (data.logoFile && data.logoFile.length > 0) {
        logoUrl = await uploadFile(data.logoFile, 'logo');
      }

      // 2. Nettoyage des fichiers pour l'insertion SQL
      const { photoFile, logoFile, ...textData } = data;
      
      const finalPayload = {
        ...textData,
        photoUrl: photoUrl, 
        logoUrl: logoUrl
      };

      // 3. Sauvegarde dans la table SQL
      const { error: insertError } = await supabase
        .from('nfc_cards')
        .insert([finalPayload]);

      if (insertError) throw insertError;

      setIsSubmitted(true);
      toast.success("Demande envoyée et enregistrée avec succès !");
    } catch (error: any) {
      console.error('Erreur lors de la soumission:', error);
      toast.error(`Erreur : ${error.message || "Impossible de sauvegarder les données"}`);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 text-center max-w-2xl mx-auto"
      >
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-serif font-bold mb-4">Demande Reçue !</h2>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Merci pour votre confiance. L'équipe de <strong>Boosting FR</strong> va analyser vos données et vous envoyer un email de confirmation pour valider le design de votre carte NFC sous 24h.
        </p>
        <button 
          onClick={() => setIsSubmitted(false)}
          className="text-primary font-bold hover:underline"
        >
          Créer une autre carte
        </button>
      </motion.div>
    );
  }

  return (
    <section id="create" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold mb-4">Personnalisez votre carte</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Remplissez les informations ci-dessous. Ces données seront encodées dans votre puce NFC et affichées sur votre profil digital.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <User size={16} /> Nom Complet
                  </label>
                  <input 
                    {...register('name')}
                    placeholder="Jean Dupont"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Briefcase size={16} /> Poste / Titre
                  </label>
                  <input 
                    {...register('title')}
                    placeholder="Directeur Commercial"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.title ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                  />
                  {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Briefcase size={16} /> Entreprise
                </label>
                <input 
                  {...register('company')}
                  placeholder="Boosting FR"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.company ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                />
                {errors.company && <p className="text-xs text-red-500">{errors.company.message}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Mail size={16} /> Email Professionnel
                  </label>
                  <input 
                    {...register('email')}
                    placeholder="jean@entreprise.com"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Phone size={16} /> Téléphone
                  </label>
                  <input 
                    {...register('phone')}
                    placeholder="+33 6 12 34 56 78"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                  />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Globe size={16} /> Site Web
                </label>
                <input 
                  {...register('website')}
                  placeholder="https://www.votre-site.com"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.website ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                />
                {errors.website && <p className="text-xs text-red-500">{errors.website.message}</p>}
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Facebook size={16} /> Facebook
                  </label>
                  <input 
                    {...register('facebook')}
                    placeholder="Lien profil"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Instagram size={16} /> Instagram
                  </label>
                  <input 
                    {...register('instagram')}
                    placeholder="Lien profil"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Calendar size={16} /> Calendly
                  </label>
                  <input 
                    {...register('calendly')}
                    placeholder="Lien de rdv"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <ImageIcon size={16} /> Photo de Profil
                  </label>
                  <input 
                    type="file"
                    accept="image/*"
                    {...register('photoFile')}
                    className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-black hover:file:bg-gray-200 cursor-pointer outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <ImageIcon size={16} /> Logo Entreprise
                  </label>
                  <input 
                    type="file"
                    accept="image/*"
                    {...register('logoFile')}
                    className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-black hover:file:bg-gray-200 cursor-pointer outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Palette size={16} /> Couleur Primaire
                  </label>
                  <div className="flex gap-3 items-center">
                    <input 
                      type="color"
                      {...register('primaryColor')}
                      className="w-12 h-12 rounded-lg cursor-pointer border-none"
                    />
                    <span className="text-sm text-gray-500 font-mono uppercase">{primaryColor}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Palette size={16} /> Couleur Accent
                  </label>
                  <div className="flex gap-3 items-center">
                    <input 
                      type="color"
                      {...register('accentColor')}
                      className="w-12 h-12 rounded-lg cursor-pointer border-none"
                    />
                    <span className="text-sm text-gray-500 font-mono uppercase">{accentColor}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-black transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="animate-pulse">Veuillez attendre le chargement...</span>
                    </>
                  ) : (
                    <>Envoyer ma configuration <Send size={20} /></>
                  )}
                </button>
                
                {isSubmitting && (
                  <p className="text-xs text-center text-gray-400 animate-pulse mt-2">
                    Téléchargement de vos médias en cours. Ne fermez pas cette fenêtre.
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Aperçu */}
          <div className="lg:col-span-5 sticky top-32">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                Aperçu de la carte
              </h3>
              
              <div 
                className="aspect-[1.6/1] rounded-2xl p-8 relative overflow-hidden shadow-2xl transition-colors duration-300 flex flex-col justify-between"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 blur-xl" />
                
                <div className="relative h-full flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm overflow-hidden border border-white/10">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <CreditCard size={24} style={{ color: accentColor }} />
                      )}
                    </div>
                    
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="text-[10px] font-bold tracking-widest opacity-60" style={{ color: accentColor }}>NFC ENABLED</p>
                      {photoPreview && (
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 shadow-md">
                          <img src={photoPreview} alt="Profil" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-2xl font-bold mb-1" style={{ color: accentColor }}>
                      {watch('name') || 'Votre Nom'}
                    </h4>
                    <p className="text-sm opacity-80" style={{ color: accentColor }}>
                      {watch('title') || 'Votre Poste'}
                    </p>
                    <p className="text-xs font-medium mt-2 opacity-60" style={{ color: accentColor }}>
                      {watch('company') || 'Votre Entreprise'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Informations de contact</p>
                  <div className="space-y-2">
                    <p className="text-sm flex items-center gap-2 text-gray-600 truncate">
                      <Mail size={14} /> {watch('email') || 'email@exemple.com'}
                    </p>
                    <p className="text-sm flex items-center gap-2 text-gray-600">
                      <Phone size={14} /> {watch('phone') || '+33 6 00 00 00 00'}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center italic">
                  *Ceci est une simulation visuelle. Le design final sera optimisé par nos graphistes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardForm;