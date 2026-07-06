import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Terminal, Cpu, Network, SlidersHorizontal, Layers3 } from "lucide-react"; 
import type { Language, Theme } from "../../App";

type Product = {
  title: string;
  eyebrow?: string;
  logo?: string;
  description: string;
  features: string[];
  modules?: string[];
  integrations?: string[];
  parameters?: string[];
  gallery?: string[] | string | { tr: string[]; en: string[] }; 
  link?: string; // Link desteği (bir önceki güncellemeden)
};

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  language: Language;
  theme: Theme;
}

export default function ProductModal({ product, onClose, language, theme }: ProductModalProps) {
  const isLight = theme === "light";
  const galleryItems = Array.isArray(product?.gallery) ? product.gallery : [];
  const heroImage = galleryItems[0] || product?.logo;
  
  const text = {
    tr: {
      systemActive: "Sistem_Aktif",
      features: "Özellikler //",
      modules: "Modül Grupları",
      integrations: "Entegrasyon Katmanı",
      parameters: "Parametrik Yapı",
      launch: "Sistemi Başlat"
    },
    en: {
      systemActive: "System_Online",
      features: "Features //",
      modules: "Module Groups",
      integrations: "Integration Layer",
      parameters: "Parametric Setup",
      launch: "Launch System"
    },
  }[language];

  // Sisteme gitmek için fonksiyon (bir önceki güncellemeden)
  const handleLaunchSystem = () => {
    if (product?.link) {
      window.open(product.link, "_blank", "noopener,noreferrer");
    } else {
      alert(language === 'tr' ? "Sistem bağlantısı henüz eklenmedi." : "System link is not added yet.");
    }
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // 🔥 DEĞİŞİKLİK BURADA: bg-black/60 yerine bg-transparent yapıldı.
          // 🔥 backdrop-blur-[4px] korundu ki arkadaki detaylar modalı yormasın.
          className={`fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 backdrop-blur-[4px] ${
            isLight ? "bg-white/20" : "bg-black/20"
          }`}
          onClick={onClose} // Arka plana tıklayınca kapanır
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()} // Modal içine tıklayınca kapanmasın
            className={`relative flex h-[calc(100vh-1.5rem)] w-full max-w-7xl flex-col overflow-hidden border border-pink-500/30 shadow-[0_0_50px_rgba(219,39,119,0.2)] sm:h-[min(820px,calc(100vh-3rem))] lg:flex-row ${
              isLight ? "bg-white/95" : "bg-[#0a0f1a]/95" // Modalın kendi arka planı korundu
            }`}
            style={{ 
              clipPath: window.innerWidth > 768 ? 'polygon(2% 0, 100% 0, 100% 96%, 98% 100%, 0 100%, 0 4%)' : 'none'
            }}
          >
            {/* KAPATMA BUTONU */}
            <button 
              onClick={onClose} 
              className={`absolute top-2 right-2 sm:top-4 sm:right-4 z-50 p-2 text-pink-500 border border-pink-500/30 backdrop-blur-sm hover:bg-pink-500 hover:text-white transition-all ${
                isLight ? "bg-white/80" : "bg-black/70"
              }`}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* SOL KISIM */}
            <div 
              className={`relative flex h-[230px] w-full shrink-0 items-center justify-center overflow-hidden border-b border-pink-500/30 lg:h-full lg:w-5/12 lg:border-b-0 lg:border-r ${
                isLight ? "bg-slate-100" : "bg-black"
              }`}
            >
              {/* Siberpunk Tarama Çizgileri */}
              <div className="absolute inset-0 z-40 pointer-events-none opacity-20" 
                   style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }} 
              />
              <div className="absolute inset-0 z-30 bg-gradient-to-tr from-pink-500/10 to-transparent mix-blend-overlay pointer-events-none" />

              {heroImage ? (
                <img
                  src={heroImage}
                  alt={`${product.title} preview`}
                  className={`absolute inset-0 h-full w-full object-cover ${isLight ? "opacity-75" : "opacity-52"}`}
                />
              ) : null}

              <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.20),transparent_45%),linear-gradient(135deg,rgba(6,182,212,0.18),rgba(15,23,42,0.86))]" />

              <motion.div
                animate={{ scale: [0.98, 1.03, 0.98], opacity: [0.86, 1, 0.86] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-20 flex w-[78%] max-w-[430px] flex-col items-center justify-center rounded-2xl border border-cyan-300/25 bg-black/35 p-5 backdrop-blur-md shadow-[0_0_42px_rgba(34,211,238,0.16)]"
              >
                <div className="relative grid h-24 w-24 place-items-center rounded-2xl border border-pink-500/35 bg-black/35 shadow-[0_0_30px_rgba(219,39,119,0.22)] sm:h-32 sm:w-32">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-2xl border-t-2 border-cyan-400"
                  />
                  {product.logo ? (
                    <img src={product.logo} alt={`${product.title} logo`} className="relative z-10 h-16 w-16 object-contain sm:h-20 sm:w-20" />
                  ) : (
                    <Cpu className="relative z-10 h-12 w-12 text-pink-500 opacity-90 sm:h-16 sm:w-16" />
                  )}
                </div>

                <div className="mt-5 text-center font-cyber text-[10px] uppercase tracking-[0.28em] text-cyan-200 sm:text-xs">
                  {product.eyebrow}
                </div>

                <div className="mt-4 grid w-full grid-cols-3 gap-2">
                  {[
                    { label: text.modules, value: product.modules?.length ?? 0 },
                    { label: text.integrations, value: product.integrations?.length ?? 0 },
                    { label: text.parameters, value: product.parameters?.length ?? 0 }
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border border-white/10 bg-white/8 px-2 py-2 text-center">
                      <div className="text-lg font-black text-pink-400">{item.value}</div>
                      <div className="mt-1 text-[8px] font-bold uppercase leading-tight tracking-wide text-slate-300">{item.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Alt Bilgi Terminali */}
              <div className="absolute bottom-0 left-0 right-0 z-50 p-3 sm:p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex items-end justify-between font-cyber text-[10px] sm:text-xs tracking-widest uppercase">
                  <div className="flex items-center gap-2 text-pink-500">
                  <div className="w-1.5 h-1.5 bg-pink-500 animate-pulse" />
                  {text.systemActive}
                </div>
              </div>
            </div>

            {/* SAĞ KISIM: BİLGİLER */}
            <div className={`relative flex min-h-0 w-full flex-1 flex-col overflow-hidden lg:w-7/12 ${
              isLight ? "bg-gradient-to-br from-white to-cyan-50" : "bg-gradient-to-br from-[#0a0f1a] to-[#120a1a]"
            }`}>
              <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-5 pr-4 sm:p-8 sm:pr-6 lg:p-10 lg:pr-8">
                <div className="flex items-center gap-2 mb-4">
                  <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                  <span className="text-pink-500 font-cyber tracking-[0.2em] uppercase text-[10px] sm:text-xs border-b border-pink-500/30 pb-1">
                    V3RII_DATABASE
                  </span>
                </div>

                {product.eyebrow ? (
                  <p className="mb-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
                    {product.eyebrow}
                  </p>
                ) : null}

                <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wider font-cyber mb-3 ${isLight ? "text-slate-900" : "text-white"}`}>
                  {product.title}
                </h2>
                
                <div className="w-12 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mb-5" />

                <p className={`font-modern leading-relaxed mb-6 text-sm sm:text-base ${isLight ? "text-slate-700" : "text-gray-300"}`}>
                  {product.description}
                </p>

                <div className="space-y-3 mb-6">
                  <h4 className="text-pink-400 font-cyber text-sm sm:text-base uppercase tracking-widest">{text.features}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className={`flex items-center gap-2 text-[12px] sm:text-sm font-modern p-2 sm:p-3 border-l border-pink-500/40 ${
                        isLight ? "text-slate-700 bg-slate-100" : "text-gray-400 bg-white/5"
                      }`}>
                        <div className="w-1 h-1 bg-pink-500 rotate-45" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pb-4 xl:grid-cols-3">
                  {[
                    { title: text.modules, icon: Layers3, items: product.modules ?? [] },
                    { title: text.integrations, icon: Network, items: product.integrations ?? [] },
                    { title: text.parameters, icon: SlidersHorizontal, items: product.parameters ?? [] }
                  ].map((section) => {
                    const SectionIcon = section.icon;
                    if (section.items.length === 0) return null;

                    return (
                      <div key={section.title} className={`rounded-xl border p-3 ${isLight ? "border-cyan-200 bg-white/75" : "border-cyan-400/20 bg-white/[0.04]"}`}>
                        <div className="mb-2 flex items-center gap-2">
                          <SectionIcon className="h-4 w-4 text-cyan-400" />
                          <h4 className={`text-xs font-black uppercase tracking-[0.18em] ${isLight ? "text-slate-800" : "text-slate-100"}`}>{section.title}</h4>
                        </div>
                        <div className="space-y-1.5">
                          {section.items.map((item, idx) => (
                            <div key={`${section.title}-${idx}`} className={`flex items-start gap-2 text-xs leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-cyan-400" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button 
                onClick={handleLaunchSystem} // Link fonksiyonu
                className="m-5 mt-0 flex shrink-0 items-center justify-center gap-2 bg-pink-600 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[0_0_20px_rgba(219,39,119,0.3)] transition-all hover:bg-pink-500 sm:m-8 sm:mt-0 sm:py-4 sm:text-sm"
              >
                {text.launch}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
