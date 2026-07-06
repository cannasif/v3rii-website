import { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, ChevronRight } from "lucide-react"; 
import { products } from "../../utils/products";
import ProductModal from "../ui/ProductModal";
import type { Language, Theme } from "../../App";

type Product = (typeof products)[number];

type Props = {
  language: Language;
  theme: Theme;
};

// DİL ÇEVİRİ OBJESİ
const translations = {
  tr: {
    sectionTitlePre: "Yazılım",
    sectionTitleHighlight: "Ürünlerimiz",
    buttonText: "İncele",
    mobileBadgeHover: "Mobil Uyumlu"
  },
  en: {
    sectionTitlePre: "Our Software",
    sectionTitleHighlight: "Products",
    buttonText: "Explore",
    mobileBadgeHover: "Mobile Compatible"
  }
};

export default function Products({ language, theme }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const lang = language; 
  const t = translations[lang]; 
  const isLight = theme === 'light'; // TEMA KONTROLÜ EKLENDİ

  return (
    <section id="products" className="py-12 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative z-10 overflow-hidden bg-transparent font-modern">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ÜST BÖLÜM: Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-20"
        >
          <div className="inline-flex items-center gap-3 sm:gap-4 mb-4">
            <div className="w-6 sm:w-8 h-0.5 bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold font-cyber tracking-wider uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {t.sectionTitlePre} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">{t.sectionTitleHighlight}</span>
            </h2>
            <div className="w-6 sm:w-8 h-0.5 bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8 items-stretch">
          {products.map((product, index) => {
            const Icon = product.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedProduct(product)}
                // TEMA UYUMLU KART ARKA PLANI VE BORDER'I
                className={`group cursor-pointer flex flex-col relative backdrop-blur-md border-l-2 border-r-2 p-6 sm:p-7 transition-all duration-300 min-h-[430px] sm:min-h-[500px] hover:border-pink-500 ${
                  isLight 
                    ? 'bg-white/80 border-purple-300 hover:bg-white hover:shadow-xl' 
                    : 'bg-[#0a0f1a]/80 border-purple-600/40 hover:bg-[#0d1424]/95'
                }`}
                style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 92%, 90% 100%, 0 100%, 0 8%)' }}
              >
                {/* Logo Bölümü */}
                <div className={`relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center transform -skew-x-12 mb-6 border transition-all duration-300 shrink-0 group-hover:border-pink-500/50 group-hover:bg-pink-500/20 ${
                  isLight ? 'bg-purple-100 border-purple-200' : 'bg-purple-500/10 border-purple-500/20'
                }`}>
                  {product.logo ? (
                    <img src={product.logo} alt={`${product.title[lang]} Logo`} className="w-12 h-12 sm:w-16 sm:h-16 transform skew-x-12 object-contain" />
                  ) : (
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-pink-400 transform skew-x-12" />
                  )}
                </div>
                
                {/* Başlık */}
                <h3 className={`text-lg sm:text-2xl font-bold mb-3 uppercase tracking-wide font-cyber group-hover:text-pink-500 transition-colors ${
                  isLight ? 'text-slate-900' : 'text-white group-hover:text-pink-300'
                }`}>
                  {product.title[lang]}
                </h3>
                
                <div className="w-8 sm:w-10 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 mb-4 sm:mb-5 group-hover:w-16 sm:group-hover:w-20 transition-all duration-500" />
                
                {/* Açıklama */}
                <p className={`text-xs sm:text-sm leading-relaxed mb-6 font-modern flex-grow ${
                  isLight ? 'text-slate-600' : 'text-gray-400'
                }`}>
                  {product.description[lang]}
                </p>
                
                {/* Özellik Listesi */}
                <div className={`space-y-2 sm:space-y-3 mb-8 text-[10px] sm:text-xs font-modern ${
                  isLight ? 'text-slate-700' : 'text-gray-300'
                }`}>
                  {product.features[lang].map((f: string, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                {/* Buton */}
                <div className="mt-auto w-full bg-gradient-to-r from-purple-600/70 to-pink-600/70 text-white font-bold py-2.5 sm:py-3 text-[10px] sm:text-sm transform -skew-x-12 transition-all duration-300 flex items-center justify-center border border-pink-400/30 group-hover:shadow-[0_0_20px_rgba(219,39,119,0.3)]">
                  <span className="transform skew-x-12 uppercase tracking-[0.2em] font-cyber">{t.buttonText} // 0{index + 1}</span>
                </div>

                {/* MOBİL UYUMLULUK ROZETİ */}
                <div 
                  className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 border transition-all duration-300 transform -skew-x-12 rounded z-10 ${
                    isLight 
                      ? 'bg-white border-cyan-300 shadow-sm group-hover:bg-cyan-50' 
                      : 'border-cyan-400/30 bg-[#050505] shadow-[0_0_15px_rgba(34,211,238,0.2)] group-hover:bg-cyan-500/10 group-hover:border-cyan-500/50'
                  }`}
                  title={t.mobileBadgeHover}
                >
                  <Smartphone className="w-4 h-4 text-cyan-400 transform skew-x-12 group-hover:scale-110 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      <ProductModal 
        product={selectedProduct ? {
          ...selectedProduct,
          title: selectedProduct.title[lang],
          description: selectedProduct.description[lang],
          features: selectedProduct.features[lang]
        } : null} 
        onClose={() => setSelectedProduct(null)} 
        language={lang}
        theme={theme}
      />
    </section>
  );
}
