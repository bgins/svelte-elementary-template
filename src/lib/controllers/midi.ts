import { get } from 'svelte/store'
import { Input, Output, WebMidi } from 'webmidi'

import type { EventEmitter } from '$lib/common/event-emitter'
import type { NoteEventMap } from '$lib/controllers'
import { midiInputs, midiStatus } from '$stores'

export type MidiStatus = 'enabled' | 'disabled' | 'unavailable'

export class Midi {
  midiAccess: WebMidi.MIDIAccess
  inputs: Input[]
  selectedInput: Input
  noteEmitter: EventEmitter<NoteEventMap>
  abortController = new AbortController()

  constructor() {
    if (navigator.requestMIDIAccess !== undefined) {
      WebMidi
        .enable()
        .then(this.initialize)
        .catch(err => {
          console.warn('WebMidi could not be initialized:', err)
          midiStatus.set('unavailable')
        })
    } else {
      console.warn('WebMidi not available in this browser')
      midiStatus.set('unavailable')
    }
  }

  initialize = (): void => {
    this.inputs = WebMidi.inputs
    const inputNames = this.inputs.map(input => input.name)

    WebMidi.addListener('connected', (event: { port: Input | Output }) => {
      const { port } = event

      if (port instanceof Input) {
        midiInputs.set([...inputNames, port.name])
      }
    })

    WebMidi.addListener('disconnected', (event: { port: Input | Output }) => {
      const { port } = event

      if (port instanceof Input) {
        midiInputs.set(inputNames.filter(name => name !== port.name))
      }
    })

    midiInputs.set(inputNames)
    midiStatus.set('disabled')
  }

  enable = (noteEmitter: EventEmitter<NoteEventMap>): void => {
    this.noteEmitter = noteEmitter
    const status = get(midiStatus)

    if (status !== 'unavailable') {
      midiStatus.set('enabled')
      const input = this.selectedInput ?? (this.inputs[0] ?? null)

      if (input) {
        this.setInput(input.name)
      } else {
        console.warn('No MIDI devices available')
      }
    }
  }

  setInput = (name: string): void => {
    const status = get(midiStatus)

    if (status === 'enabled') {
      this.noteEmitter.emit('stopAll')

      // Remove listeners from the previous input
      if (this.selectedInput) {
        this.selectedInput.removeListener('noteon')
        this.selectedInput.removeListener('noteoff')
      }

      // Set the new input
      this.selectedInput = WebMidi.getInputByName(name)

      // Add listeners
      this.selectedInput.addListener('noteon', event => {
        const status = get(midiStatus)

        if (status === 'enabled') {
          const midiNote = event.note.number
          this.noteEmitter.emit('play', { midiNote })
        }
      })

      this.selectedInput.addListener('noteoff', event => {
        const status = get(midiStatus)

        if (status === 'enabled') {
          const midiNote = event.note.number
          this.noteEmitter.emit('stop', { midiNote })
        }
      })

    } else {
      console.error('WebMidi not enabled')
    }
  }

  disable = (): void => {
    if (this.noteEmitter) {
      this.noteEmitter.emit('stopAll')
    }

    this.noteEmitter = null
    midiStatus.set('disabled')
  }
}