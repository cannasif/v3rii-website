import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Terminal, Cpu } from "lucide-react"; 
import type { Language, Theme } from "../../App";

type Product = {
  title: string;
  description: string;
  features: string[];
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
  
  const text = {
    tr: { systemActive: "Sistem_Aktif", features: "Özellikler //", launch: "Sistemi Başlat" },
    en: { systemActive: "System_Online", features: "Features //", launch: "Launch System" },
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
          className={`fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 backdrop-blur-[4px] ${
            isLight ? "bg-white/10" : "bg-transparent"
          }`}
          onClick={onClose} // Arka plana tıklayınca kapanır
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()} // Modal içine tıklayınca kapanmasın
            className={`w-full max-w-6xl max-h-[92vh] border border-pink-500/30 shadow-[0_0_50px_rgba(219,39,119,0.2)] relative flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden ${
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
              className={`w-full lg:w-3/5 relative aspect-video lg:aspect-auto min-h-[250px] sm:min-h-[400px] border-b lg:border-b-0 lg:border-r border-pink-500/30 overflow-hidden flex items-center justify-center ${
                isLight ? "bg-slate-200" : "bg-black"
              }`}
            >
              {/* Siberpunk Tarama Çizgileri */}
              <div className="absolute inset-0 z-40 pointer-events-none opacity-20" 
                   style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }} 
              />
              <div className="absolute inset-0 z-30 bg-gradient-to-tr from-pink-500/10 to-transparent mix-blend-overlay pointer-events-none" />

              {/* FOTO YERİNE DÖNEN SİBER ÇEKİRDEK ANİMASYONU */}
              <motion.div
                animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-20 flex flex-col items-center justify-center"
              >
                <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full border border-pink-500/30 flex items-center justify-center relative shadow-[0_0_30px_rgba(219,39,119,0.2)]">
                   <motion.div
                     animate={{ rotate: 360 }}
                     transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                     className="absolute inset-0 border-t-2 border-pink-500 rounded-full"
                   />
                   <div className="absolute inset-0 bg-pink-500/10 blur-xl rounded-full" />
                   <Cpu className="w-12 h-12 sm:w-16 sm:h-16 text-pink-500 opacity-80" />
                </div>
                <div className="mt-8 font-cyber text-pink-500 tracking-[0.4em] text-xs sm:text-sm uppercase opacity-80">
                   V3RII_CORE_ACTIVE
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
            <div className={`w-full lg:w-2/5 p-5 sm:p-8 lg:p-10 flex flex-col relative ${
              isLight ? "bg-gradient-to-br from-white to-cyan-50" : "bg-gradient-to-br from-[#0a0f1a] to-[#120a1a]"
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                <span className="text-pink-500 font-cyber tracking-[0.2em] uppercase text-[10px] sm:text-xs border-b border-pink-500/30 pb-1">
                  V3RII_DATABASE
                </span>
              </div>

              <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wider font-cyber mb-3 ${isLight ? "text-slate-900" : "text-white"}`}>
                {product.title}
              </h2>
              
              <div className="w-12 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mb-5" />

              <p className={`font-modern leading-relaxed mb-6 text-sm sm:text-base ${isLight ? "text-slate-700" : "text-gray-300"}`}>
                {product.description}
              </p>

              <div className="space-y-3 mb-8">
                <h4 className="text-pink-400 font-cyber text-sm sm:text-base uppercase tracking-widest">{text.features}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
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

              <button 
                onClick={handleLaunchSystem} // Link fonksiyonu
                className="w-full mt-auto bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 sm:py-4 text-xs sm:text-sm uppercase tracking-[0.2em] font-cyber shadow-[0_0_20px_rgba(219,39,119,0.3)] flex items-center justify-center gap-2 group transition-all"
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