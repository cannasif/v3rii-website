import { motion } from "framer-motion";
import wmsImage from "../../../assets/wms.png"; // 👈 kendi dosyaa

type Product = {
  title: string;
  description: string;
  features: string[];
};

type WmsModalProps = {
  product: Product;
  onClose: () => void;
};

export default function WmsModal({ product, onClose }: WmsModalProps) {
  return (
    <div
      className="
        relative
        grid 
        grid-cols-1
        md:grid-cols-2
        gap-6 sm:gap-8
        items-start
      "
    >
      {/* ✕ KAPAT */}
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.2, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        className="
          absolute 
          top-2 sm:top-3 md:top-4 
          right-2 sm:right-3 md:right-4 
          text-emerald-300 
          hover:text-emerald-100
          transition-colors duration-300
          text-xl sm:text-2xl font-bold
          drop-shadow-[0_0_8px_rgba(52,211,153,1)]
        "
      >
        ✕
      </motion.button>

      {/* SOL */}
      <div className="relative">
        <div
          className="
            relative rounded-2xl overflow-hidden 
            border border-emerald-400/40 
            shadow-[0_0_30px_rgba(52,211,153,0.6)]
          "
        >
          <img
            src={wmsImage}
            alt={product.title}
            className="w-full h-auto object-contain"
          />
          <div
            className="
              absolute inset-0 bg-gradient-to-tr 
              from-emerald-500/20 via-transparent to-cyan-500/25 
              mix-blend-screen
            "
          />
        </div>
      </div>

      {/* SAĞ */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          {product.title}
        </h2>

        <p className="text-gray-300 mb-6 leading-relaxed text-sm sm:text-base">
          {product.description}
        </p>

        <h3 className="text-base sm:text-lg text-emerald-400 font-semibold mb-3">
          Özellikler:
        </h3>

        <ul className="space-y-2 mb-6 sm:mb-8">
          {product.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-200">
              <div className="mt-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-sm sm:text-base">{f}</span>
            </li>
          ))}
        </ul>

        <div className="flex gap-3 flex-wrap">
          <button
            className="
              px-5 py-3 sm:px-6 sm:py-3 rounded-xl 
              bg-emerald-600/90 hover:bg-emerald-500 
              text-white font-semibold transition-colors
              text-sm sm:text-base
            "
          >
            Depo Simülasyonu İste
          </button>

          <button
            onClick={onClose}
            className="
              px-5 py-3 sm:px-6 sm:py-3 rounded-xl 
              border border-emerald-400/60 
              text-emerald-200 hover:bg-emerald-500/10 
              transition-colors
              text-sm sm:text-base
            "
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
