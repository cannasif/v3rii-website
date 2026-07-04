 {/*import CodeBackground from '../components/ui/CodeBackground'  */}
import Hero from '../components/sections/Hero'
import Products from '../components/sections/Products'
import About from '../components/sections/About'
import Contact from '../components/sections/Contact'
import FadeInSection from '../components/ui/FadeInSection'
import BinaryRain from '../components/ui/BinaryRain'
import type { Language, Theme } from '../App'

type Props = {
  language: Language
  theme: Theme
}

export default function Home({ language, theme }: Props) {
  const isLight = theme === 'light'

  return (
    <div className="min-h-screen relative">
      {!isLight && <BinaryRain />}

      {/*
        <CodeBackground speed={75} opacity={0.3} />
      */}
      <FadeInSection fadeOffset={20} parallaxDepth={90}>
        <Hero language={language} theme={theme} />
      </FadeInSection>
      <FadeInSection delay={0.05} parallaxDepth={130}>
        <Products language={language} theme={theme} />
      </FadeInSection>
      <FadeInSection delay={0.1} parallaxDepth={115}>
        <About language={language} theme={theme} />
      </FadeInSection>
      <FadeInSection delay={0.15} parallaxDepth={105}>
        <Contact language={language} theme={theme} />
      </FadeInSection>
    </div>
  )
}
