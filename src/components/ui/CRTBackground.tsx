/**
 * Eski tüplü TV / terminal ekranı hissi veren sabit arka plan katmanı.
 * - Karıncalı grain dokusu (::before)
 * - İnce tarama çizgileri (::after)
 * - Yavaşça aşağı süzülen parlaklık bandı (.crt-roll)
 * - Çok nadir tetiklenen yatay glitch bantları (.crt-glitch)
 * Hem aydınlık hem koyu temada çalışır; stiller index.css'te.
 */
export default function CRTBackground() {
  return (
    <div className="crt-bg" aria-hidden="true">
      <div className="crt-roll" />
      <div className="crt-glitch" />
    </div>
  )
}
