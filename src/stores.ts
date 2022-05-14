import type { Writable } from 'svelte/store'
import type WebAudioRenderer from '@elemaudio/web-renderer-lite'

import { writable } from 'svelte/store'

import type { MidiStatus } from '$lib/controllers/midi'

type AudioStore = {
  context: AudioContext
  elementaryReady: boolean
  core: WebAudioRenderer
}

export const audioStore: Writable<AudioStore> = writable({
  context: null,
  elementaryReady: false,
  core: null
})

export const tuning: Writable<string> = writable('ED2-12')

export const midiStatus: Writable<MidiStatus> = writable('disabled')

export const midiInputs: Writable<string[]> = writable([] as string[])