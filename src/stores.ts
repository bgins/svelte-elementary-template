import type { Writable } from 'svelte/store'
import { writable } from 'svelte/store'

import type { MidiStatus } from '$lib/controllers/midi'

type AudioStore = {
  context: AudioContext
  contextState: AudioContextState
  elementaryReady: boolean
}

export const audioStore: Writable<AudioStore> = writable({ context: null, contextState: 'closed', elementaryReady: false })

export const tuning: Writable<string> = writable('ED2-12')

export const midiStatus: Writable<MidiStatus> = writable('disabled')

export const midiInputs: Writable<Record<string, WebMidi.MIDIInput>> = writable({})