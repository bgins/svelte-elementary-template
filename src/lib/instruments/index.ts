import type { NodeRepr_t } from '@elemaudio/core'

import { tune } from '$lib/tuning'

export type Config = {
  selectedController: 'keyboard' | 'midi' | 'none'
  keyboardStatus: 'playing' | 'typing'
}

export type Channels = { left: NodeRepr_t | number; right: NodeRepr_t | number }

export type Voice = { gate: number; freq: number; key: string }


export const updateVoices = (voices: Voice[], midiNote: number): Voice[] => {
  const key = `v${midiNote}`
  const freq = tune(midiNote)

  console.log(`MIDI note: ${midiNote}`, `, Frequency: ${freq}`)

  return voices.filter(voice => voice.key !== key).concat({ gate: 0.1, freq, key })
}