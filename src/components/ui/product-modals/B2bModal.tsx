import b2bImage from '../../../assets/b2b.png'

type Product = {
  title: string
  description: string
  features: string[]
}

type B2bModalProps = {
  product: Product
  onClose: () => void
}

export default function B2bModal({ product, onClose }: B2bModalProps) {
  return (
    <div
      className="
        grid 
        grid-cols-1
        md:grid-cols-2 
        gap-6 sm:gap-8 
        items-start
      "
    >
      <div className="relative">
        <div
          className="
            relative rounded-2xl overflow-hidden 
            border border-indigo-400/40 
            shadow-[0_0_30px_rgba(129,140,248,0.7)]
          "
        >
          <img
            src={b2bImage}
            alt={product.title}
            className="w-full h-auto object-contain"
          />
          <div
            className="
              absolute inset-0 
              bg-gradient-to-tr 
              from-indigo-500/25 
              via-transparent 
              to-cyan-500/25 
              mix-blend-screen
            "
          />
        </div>
      </div>

      <div>
        <h2
          className="
            text-2xl sm:text-3xl 
            font-bold text-white mb-4
          "
        >
          {product.title}
        </h2>

        <p
          className="
            text-gray-300 
            mb-6 sm:mb-8 
            leading-relaxed 
            text-sm sm:text-base
          "
        >
          {product.description}
        </p>

        <h3
          className="
            text-base sm:text-lg 
            text-indigo-300 font-semibold mb-3
          "
        >
          Özellikler:
        </h3>

        <ul className="space-y-2 mb-6 sm:mb-8">
          {product.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-200">
              <div className="mt-1 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
              <span className="text-sm sm:text-base">{f}</span>
            </li>
          ))}
        </ul>

        <div className="flex gap-3 flex-wrap">
          <button
            className="
              px-5 py-3 sm:px-6 sm:py-3 
              rounded-xl 
              bg-indigo-600/90 hover:bg-indigo-500 
              text-white font-semibold 
              transition-colors
              text-sm sm:text-base
            "
          >
            Canlı Demo
          </button>

          <button
            onClick={onClose}
            className="
              px-5 py-3 sm:px-6 sm:py-3 
              rounded-xl 
              border border-indigo-400/60 
              text-indigo-200 
              hover:bg-indigo-500/10 
              transition-colors
              text-sm sm:text-base
            "
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  )
}
