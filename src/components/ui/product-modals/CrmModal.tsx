import { motion } from 'framer-motion'
import crmImage from '../../../assets/crm.png'

type Product = {
  title: string
  description: string
  features: string[]
}

type CrmModalProps = {
  product: Product
  onClose: () => void
}

export default function CrmModal({ product, onClose }: CrmModalProps) {
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
          text-cyan-300 
          hover:text-cyan-100
          transition-colors duration-300
          text-xl sm:text-2xl font-bold
          drop-shadow-[0_0_8px_rgba(34,211,238,1)]
        "
      >
        ✕
      </motion.button>

      {/* SOL */}
      <div className="relative">
        <div
          className="
            relative rounded-2xl overflow-hidden 
            border border-cyan-400/40 
            shadow-[0_0_30px_rgba(34,211,238,0.6)]
          "
        >
          <img
            src={crmImage}
            alt={product.title}
            className="w-full h-auto object-contain"
          />
          <div
            className="
              absolute inset-0 bg-gradient-to-tr 
              from-cyan-500/20 via-transparent to-purple-500/25 
              mix-blend-screen
            "
          />
        </div>

        <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 text-[10px] sm:text-xs">
          <span className="
            px-3 py-1 rounded-full 
            border border-cyan-400/50 
            text-cyan-300 bg-cyan-500/10
          ">
            AI Destekli CRM
          </span>
          <span className="
            px-3 py-1 rounded-full 
            border border-purple-400/50 
            text-purple-300 bg-purple-500/10
          ">
            Satış Otomasyonu
          </span>
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

        <h3 className="text-base sm:text-lg text-cyan-400 font-semibold mb-3">
          Özellikler:
        </h3>

        <ul className="space-y-2 mb-6 sm:mb-8">
          {product.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-200">
              <div className="mt-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <span className="text-sm sm:text-base">{f}</span>
            </li>
          ))}
        </ul>

        <div className="flex gap-3 flex-wrap">
          <button
            className="
              px-5 py-3 sm:px-6 sm:py-3 rounded-xl 
              bg-gradient-to-r from-cyan-500 to-purple-500 
              text-white font-semibold
              shadow-[0_0_24px_rgba(59,130,246,0.7)] 
              hover:shadow-[0_0_32px_rgba(129,140,248,0.9)]
              transition-all duration-200
              text-sm sm:text-base
            "
          >
            Demo Talep Et
          </button>
        </div>
      </div>
    </div>
  )
}
