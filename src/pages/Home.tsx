import Hero from '../components/sections/Hero'
import Products from '../components/sections/Products'
import About from '../components/sections/About'
import Contact from '../components/sections/Contact'
import FadeInSection from '../components/ui/FadeInSection'
import CRTBackground from '../components/ui/CRTBackground'
import type { Language, Theme } from '../App'

type Props = {
  language: Language
  theme: Theme
}

export default function Home({ language, theme }: Props) {
  return (
    <div className="min-h-screen relative">
      <CRTBackground />
      <FadeInSection fadeOffset={20} parallaxDepth={90}>
        <Hero language={language} theme={theme} />
      </FadeInSection>
      <FadeInSection delay={0.05} parallaxDepth={130}>
        <Products language={language} theme={theme} />
      </FadeInSection>
      <FadeInSection delay={0.12} parallaxDepth={115}>
        <About language={language} theme={theme} />
      </FadeInSection>
      <FadeInSection delay={0.15} parallaxDepth={105}>
        <Contact language={language} theme={theme} />
      </FadeInSection>
    </div>
  )
}
