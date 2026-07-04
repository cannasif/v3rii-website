import AnimatedButton from '../ui/AnimatedButton'
import { useScrollToSection } from '../../hooks/useScrollToSection'

export default function CTA() {
  const scrollToSection = useScrollToSection(80)
  return (
    <div className="py-12 text-center">
      <AnimatedButton label="Ürünleri Keşfet" onClick={() => scrollToSection('products')} />
      <span className="mx-4" />
      <AnimatedButton label="Demo İzle 2 " variant="outline" />
    </div>
  )
}

