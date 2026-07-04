export function useScrollToSection(offset = 80) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      // getBoundingClientRect-based position is more reliable with transformed/parallax wrappers
      const elementPosition = element.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top: Math.max(elementPosition, 0), behavior: 'smooth' })
    }
  }
  return scrollToSection
}

