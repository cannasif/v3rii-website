import { useCallback, useRef } from 'react'

let sharedCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!sharedCtx) {
    const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return null
    sharedCtx = new Ctx()
  }
  if (sharedCtx.state === 'suspended') {
    void sharedCtx.resume()
  }
  return sharedCtx
}

function playChunk(
  ctx: AudioContext,
  master: GainNode,
  time: number,
  freq: number,
  volume: number,
  decay = 0.045
) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'square'
  osc.frequency.setValueAtTime(freq, time)
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.35), time + decay)
  gain.gain.setValueAtTime(volume, time)
  gain.gain.exponentialRampToValueAtTime(0.001, time + decay + 0.01)
  osc.connect(gain)
  gain.connect(master)
  osc.start(time)
  osc.stop(time + decay + 0.02)
}

function playNoiseTick(
  ctx: AudioContext,
  master: GainNode,
  time: number,
  volume: number
) {
  const len = Math.floor(ctx.sampleRate * 0.012)
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.18))
  }
  const src = ctx.createBufferSource()
  src.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 600
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(volume, time)
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.014)
  src.connect(filter)
  filter.connect(gain)
  gain.connect(master)
  src.start(time)
  src.stop(time + 0.016)
}

// Mekanik anahtar sesi: filtrelenmiş gürültü darbesi (osilatör süpürmesi yok, lazer hissi vermez)
function playSwitchClack(
  ctx: AudioContext,
  master: GainNode,
  time: number,
  centerFreq: number,
  volume: number,
  durationSec = 0.02
) {
  const len = Math.floor(ctx.sampleRate * durationSec)
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.25))
  }
  const src = ctx.createBufferSource()
  src.buffer = buffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = centerFreq
  filter.Q.value = 1.6

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(volume, time)
  gain.gain.exponentialRampToValueAtTime(0.001, time + durationSec)

  src.connect(filter)
  filter.connect(gain)
  gain.connect(master)
  src.start(time)
  src.stop(time + durationSec + 0.01)

  // Plastik gövde rezonansı: sabit frekanslı çok kısa tok vuruş
  const knock = ctx.createOscillator()
  const knockGain = ctx.createGain()
  knock.type = 'sine'
  knock.frequency.setValueAtTime(centerFreq * 0.22, time)
  knockGain.gain.setValueAtTime(volume * 0.9, time)
  knockGain.gain.exponentialRampToValueAtTime(0.001, time + 0.03)
  knock.connect(knockGain)
  knockGain.connect(master)
  knock.start(time)
  knock.stop(time + 0.035)
}

export function useCyberClick() {
  const lastPlay = useRef(0)

  const playSwitchClick = useCallback((turningOn: boolean) => {
    const now = Date.now()
    if (now - lastPlay.current < 120) return
    lastPlay.current = now

    const ctx = getAudioContext()
    if (!ctx) return

    const t = ctx.currentTime
    const master = ctx.createGain()
    master.gain.setValueAtTime(1, t)
    master.connect(ctx.destination)

    // Gerçek duvar anahtarı: hafif ön tık + hemen ardından tok "klak". Süpürme yok.
    playSwitchClack(ctx, master, t, turningOn ? 1500 : 1300, 0.22, 0.012)
    playSwitchClack(ctx, master, t + 0.045, turningOn ? 950 : 800, 0.5, 0.025)
  }, [])

  const playLangClick = useCallback(() => {
    const ctx = getAudioContext()
    if (!ctx) return

    const t = ctx.currentTime
    const master = ctx.createGain()
    master.gain.setValueAtTime(0.85, t)
    master.connect(ctx.destination)

    playNoiseTick(ctx, master, t, 0.12)
    playChunk(ctx, master, t, 520, 0.14, 0.025)

    playChunk(ctx, master, t + 0.06, 780, 0.12, 0.022)
    playChunk(ctx, master, t + 0.11, 1040, 0.1, 0.02)

    const ping = ctx.createOscillator()
    const pingGain = ctx.createGain()
    ping.type = 'square'
    ping.frequency.setValueAtTime(1320, t + 0.16)
    ping.frequency.exponentialRampToValueAtTime(660, t + 0.19)
    pingGain.gain.setValueAtTime(0.08, t + 0.16)
    pingGain.gain.exponentialRampToValueAtTime(0.001, t + 0.21)
    ping.connect(pingGain)
    pingGain.connect(master)
    ping.start(t + 0.16)
    ping.stop(t + 0.22)
  }, [])

  return { playSwitchClick, playLangClick }
}
