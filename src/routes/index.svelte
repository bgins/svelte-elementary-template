<script lang="ts">
  import { onMount } from 'svelte'

  import type { NodeRepr_t } from '@elemaudio/core'
  import type * as instrument from '$lib/instruments'

  import { Engine } from '$lib/engine'
  import { Keyboard } from '$lib/controllers/keyboard'
  import { Midi } from '$lib/controllers/midi'
  import { EventEmitter } from '$lib/common/event-emitter'
  import BaseSynth from '$components/instruments/BaseSynth.svelte'

  const engine = new Engine()
  const keyboard = new Keyboard()
  const midi = new Midi()
  const noteEmitter = new EventEmitter()

  keyboard.enable(noteEmitter)

  let config: instrument.Config = {
    selectedController: 'keyboard',
    keyboardStatus: 'playing',
    sequencerStatus: 'paused'
  }

  onMount(async () => {
    await engine.initialize()
  })

  const startAudio = async () => {
    await engine.startAudio()
  }

  const suspendAudio = async () => {
    noteEmitter.dispatchEvent('stopAll')
    await engine.suspendAudio()
  }

  const render = (event: CustomEvent<{ node: number | NodeRepr_t }>) => {
    const { node } = event.detail

    engine.render(node)
  }

  const setController = (event: CustomEvent<{ controller: string }>) => {
    const { controller } = event.detail

    if (controller === 'MIDI') {
      keyboard.disable()
      midi.enable(noteEmitter)

      config = {
        ...config,
        selectedController: 'midi'
      }
    } else if (controller === 'Keyboard') {
      midi.disable()
      keyboard.enable(noteEmitter)

      config = {
        ...config,
        selectedController: 'keyboard'
      }
    }
  }

  const setMidiInput = (event: CustomEvent<{ midiInput: string }>) => {
    const { midiInput } = event.detail

    midi.setInput(midiInput)
  }

  const setKeyboardStatus = (event: CustomEvent<{ focused: boolean }>) => {
    const { focused: paramFocused } = event.detail

    if (paramFocused) {
      config = {
        ...config,
        keyboardStatus: 'typing'
      }
    } else {
      config = {
        ...config,
        keyboardStatus: 'playing'
      }
    }
  }
</script>

<div
  class="grid grid-flow-row auto-rows-max justify-center bg-neutral h-screen p-10 text-base-content"
>
  <BaseSynth
    bind:config
    {noteEmitter}
    on:controller={setController}
    on:midiinput={setMidiInput}
    on:paramfocus={setKeyboardStatus}
    on:render={render}
    on:startaudio={startAudio}
    on:suspendaudio={suspendAudio}
  />
</div>

<style>
</style>
