import { tune } from '$lib/tuning'

export type Config = {
  selectedController: 'keyboard' | 'midi' | 'none'
  keyboardStatus: 'playing' | 'typing'
  sequencerStatus: 'playing' | 'paused'
}

export type Voice = { gate: number; freq: number; key: string }


export const updateVoices = (voices: Voice[], midiNote: number): Voice[] => {
  const key = `v${midiNote}`
  const freq = tune(midiNote)

  console.log(`MIDI note: ${midiNote}`, `, Frequency: ${freq}`)

  return voices.filter(voice => voice.key !== key).concat({ gate: 0.1, freq, key })
}