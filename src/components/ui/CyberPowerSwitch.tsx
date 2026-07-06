import { useCyberClick } from '../../hooks/useCyberClick'
import type { Language, Theme } from '../../App'

type Props = {
  theme: Theme
  language: Language
  onToggle: () => void
}

export default function CyberPowerSwitch({ theme, language, onToggle }: Props) {
  const isLight = theme === 'light'
  const { playSwitchClick } = useCyberClick()

  const labels = {
    tr: { tag: 'IŞIK', on: 'AÇIK', off: 'KAPALI' },
    en: { tag: 'LIGHT', on: 'ON', off: 'OFF' },
  }[language]

  const handleToggle = () => {
    playSwitchClick(!isLight)
    onToggle()
  }

  return (
    <div className="cyber-power-unit">
      <span className="cyber-power-label">{labels.tag}</span>
      <button
        type="button"
        onClick={handleToggle}
        className={`cyber-breaker ${isLight ? 'cyber-breaker-on' : 'cyber-breaker-off'}`}
        aria-label={isLight ? 'Turn lights off' : 'Turn lights on'}
        title={isLight ? labels.on : labels.off}
      >
        <span className="cyber-breaker-housing">
          <span className="cyber-breaker-screw cyber-breaker-screw-l" />
          <span className="cyber-breaker-screw cyber-breaker-screw-r" />

          <span className={`cyber-breaker-bulb ${isLight ? 'cyber-breaker-bulb-lit' : ''}`} aria-hidden="true">
            <span className="cyber-breaker-bulb-glass" />
            <span className="cyber-breaker-bulb-filament" />
          </span>

          <span className="cyber-breaker-track">
            <span className={`cyber-breaker-rocker ${isLight ? 'cyber-breaker-rocker-on' : 'cyber-breaker-rocker-off'}`}>
              <span className="cyber-breaker-rocker-face" />
            </span>
          </span>

          <span className="cyber-breaker-markers" aria-hidden="true">
            <span className={isLight ? 'cyber-breaker-marker-active' : ''}>{labels.on}</span>
            <span className={!isLight ? 'cyber-breaker-marker-active' : ''}>{labels.off}</span>
          </span>
        </span>
      </button>
    </div>
  )
}
