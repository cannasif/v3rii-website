import { useEffect, useState } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import ScrollToTopButton from './components/ui/ScrollToTopButton'
import SupportChatbot from './features/support-chatbot/components/SupportChatbot'

export type Language = 'tr' | 'en'
export type Theme = 'dark' | 'light'

function App() {
  const [language, setLanguage] = useState<Language>('tr')
  const [theme, setTheme] = useState<Theme>('dark')
  
  // YENİ: URL yolunu (path) tutan state
  const [currentPath] = useState(window.location.pathname)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null
    const savedTheme = localStorage.getItem('theme') as Theme | null

    if (savedLanguage === 'tr' || savedLanguage === 'en') {
      setLanguage(savedLanguage)
    }

    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  // =================================================================
  // YENİ: 404 SAYFASI (Eğer URL ana sayfa '/' değilse bu ekran çıkar)
  // =================================================================
  if (currentPath !== '/' && currentPath !== '/index.html') {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 text-center font-cyber relative overflow-hidden ${
        theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-[#0a0f1a] text-white'
      }`}>
        {/* Arka plan siberpunk çizgileri */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] bg-[repeating-linear-gradient(180deg,transparent_0px,transparent_2px,#ffffff10_3px,#ffffff10_4px)]" />
        
        <h1 className="text-7xl md:text-9xl font-bold text-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.8)] mb-4 animate-pulse">
          404
        </h1>
        
        <h2 className="text-2xl md:text-4xl text-cyan-400 mb-6 tracking-[0.3em] uppercase drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
          {language === 'tr' ? 'Sistem Bulunamadı' : 'System Not Found'}
        </h2>
        
        <p className={`font-modern max-w-lg mb-10 ${theme === 'light' ? 'text-slate-600' : 'text-gray-400'}`}>
          {language === 'tr' 
            ? '>_ HATA: Aradığınız sayfa veri tabanımızda mevcut değil veya erişimi kısıtlanmış olabilir.' 
            : '>_ ERROR: The page you are looking for does not exist in our database or access is restricted.'}
        </p>
        
        <button
          onClick={() => window.location.href = '/'}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(34,211,238,0.4)] tracking-widest uppercase border border-cyan-400/50"
        >
          {language === 'tr' ? 'Ana Sisteme Dön' : 'Return to Main System'}
        </button>
      </div>
    )
  }

  // =================================================================
  // ANA SAYFA RENDER
  // =================================================================
  return (
    <>
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeToggle={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
      />
      <Home language={language} theme={theme} />
      <Footer language={language} theme={theme} />
      <ScrollToTopButton language={language} theme={theme} />
      <SupportChatbot language={language} theme={theme} />
    </>
  )
}

export default App
