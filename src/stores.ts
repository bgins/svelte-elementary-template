import { writable } from 'svelte/store'

import type WebAudioRenderer from '@elemaudio/web-renderer-lite'
import type { Writable } from 'svelte/store'

import { loadTheme } from '$lib/theme'

import type { MidiStatus } from '$lib/controllers/midi'
import type { Theme } from '$lib/theme'

type EngineStore = {
  context: AudioContext
  elementaryReady: boolean
  core: WebAudioRenderer
}

export const engineStore: Writable<EngineStore> = writable({
  context: null,
  elementaryReady: false,
  core: null
})

export const theme: Writable<Theme> = writable(loadTheme())

export const tuning: Writable<string> = writable('ED2-12')

export const midiStatus: Writable<MidiStatus> = writable('disabled')

export const midiInputs: Writable<string[]> = writable([] as string[])