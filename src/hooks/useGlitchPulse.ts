import { useEffect, useState } from 'react'

export function useGlitchPulse(intervalMs = 5000, durationMs = 480) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const pulse = () => {
      setActive(true)
      timeoutId = setTimeout(() => setActive(false), durationMs)
    }

    pulse()
    const intervalId = setInterval(pulse, intervalMs)

    return () => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
  }, [intervalMs, durationMs])

  return active
}
