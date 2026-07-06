import { useCyberClick } from '../../hooks/useCyberClick'
import type { Language } from '../../App'

type Props = {
  language: Language
  onLanguageChange: (language: Language) => void
  theme: 'dark' | 'light'
}

export default function CyberLangToggle({ language, onLanguageChange, theme }: Props) {
  const isLight = theme === 'light'
  const { playLangClick } = useCyberClick()

  const select = (lang: Language) => {
    if (lang === language) return
    playLangClick()
    onLanguageChange(lang)
  }

  return (
    <div className="cyber-lang-unit">
      <span className="cyber-lang-label" aria-hidden="true">
        LANG
      </span>
      <div
        className={`cyber-lang-toggle ${isLight ? 'cyber-lang-light' : 'cyber-lang-dark'}`}
        role="group"
        aria-label="Language"
      >
        {(['tr', 'en'] as const).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => select(lang)}
            className={`cyber-lang-btn ${language === lang ? 'cyber-lang-active' : ''}`}
            aria-pressed={language === lang}
          >
            <span className="cyber-lang-btn-text">{lang}</span>
            {language === lang && <span className="cyber-lang-cursor" aria-hidden="true">_</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
