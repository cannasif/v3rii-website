import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Terminal, Cpu, Network, SlidersHorizontal, Layers3 } from "lucide-react"; 
import type { Language, Theme } from "../../App";

type Product = {
  productKey?: string;
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

  // ESC tuşu ile kapatma + modal açıkken sayfa scroll'unu kilitle
  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    // Asıl kayan eleman html olduğu için kilidi hem html'e hem body'ye uygula
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [product, onClose]);

  // Yüzen butonlar (Yukarı Çık, AI asistan) modal açıkken gizlensin
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("v3rii-product-modal-toggle", {
      detail: {
        open: Boolean(product),
        productKey: product?.productKey,
        title: product?.title
      }
    }));
    return () => {
      window.dispatchEvent(new CustomEvent("v3rii-product-modal-toggle", { detail: { open: false } }));
    };
  }, [product]);

  // Sisteme gitmek için fonksiyon (bir önceki güncellemeden)
  const handleLaunchSystem = () => {
    if (product?.link) {
      window.open(product.link, "_blank", "noopener,noreferrer");
    } else {
      alert(language === 'tr' ? "Sistem bağlantısı henüz eklenmedi." : "System link is not added yet.");
    }
  };

  // Portal: Products section içindeki transform'lu sarmalayıcılar fixed konumlandırmayı
  // bozduğu için modal doğrudan body altına render edilir (blur tüm sayfayı kaplar)
  return createPortal(
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 backdrop-blur-[10px] ${
            isLight ? "bg-white/40" : "bg-black/45"
          }`}
          onClick={onClose} // Arka plana tıklayınca kapanır
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()} // Modal içine tıklayınca kapanmasın
            className={`relative flex h-[calc(100vh-1.5rem)] w-full max-w-[84rem] flex-col overflow-hidden border border-pink-500/30 shadow-[0_0_50px_rgba(219,39,119,0.2)] sm:h-[min(900px,calc(100vh-2.5rem))] ${
              isLight ? "bg-white/95" : "bg-[#0a0f1a]/95" // Modalın kendi arka planı korundu
            }`}
            style={{ 
              clipPath: window.innerWidth > 768 ? 'polygon(2% 0, 100% 0, 100% 96%, 98% 100%, 0 100%, 0 4%)' : 'none'
            }}
          >
            {/* KAPATMA BUTONU */}
            <button 
              onClick={onClose} 
              className={`absolute top-2 right-2 sm:top-4 sm:right-4 z-[60] p-2 text-pink-500 border border-pink-500/30 backdrop-blur-sm hover:bg-pink-500 hover:text-white transition-all ${
                isLight ? "bg-white/80" : "bg-black/70"
              }`}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Mobilde tüm modal tek parça kaydırılır; masaüstünde sağ panel kendi içinde kayar */}
            <div className="custom-scrollbar flex min-h-0 w-full flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">

            {/* SOL KISIM */}
            <div 
              className={`relative flex h-[280px] w-full shrink-0 items-center justify-center overflow-hidden border-b border-pink-500/30 sm:h-[340px] lg:h-auto lg:min-h-0 lg:w-5/12 lg:self-stretch lg:border-b-0 lg:border-r ${
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
                  className={`absolute inset-0 h-full w-full object-cover ${isLight ? "opacity-75" : "opacity-[0.55]"}`}
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
            <div className={`relative flex w-full flex-col lg:min-h-0 lg:w-7/12 lg:flex-1 lg:overflow-hidden ${
              isLight ? "bg-gradient-to-br from-white to-cyan-50" : "bg-gradient-to-br from-[#0a0f1a] to-[#120a1a]"
            }`}>
              <div className="p-5 pr-4 sm:p-8 sm:pr-6 lg:custom-scrollbar lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:p-10 lg:pr-8">
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
                className="group relative m-5 mt-0 flex shrink-0 items-center justify-center gap-2 overflow-hidden bg-gradient-to-r from-pink-600 via-orange-500 to-amber-400 py-3.5 font-cyber text-xs font-bold uppercase tracking-[0.25em] text-white shadow-[0_0_20px_rgba(219,39,119,0.35)] transition-all duration-300 hover:shadow-[0_0_36px_rgba(219,39,119,0.55)] sm:m-8 sm:mt-0 sm:py-4 sm:text-sm"
                style={{ clipPath: 'polygon(2.5% 0, 100% 0, 100% 65%, 97.5% 100%, 0 100%, 0 35%)' }}
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                {text.launch}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
