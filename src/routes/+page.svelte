<script lang="ts">
  import { onMount } from 'svelte'

  import type * as controller from '$lib/controllers'
  import { type Channels, Engine } from '$lib/audio/engine'
  import { Keyboard } from '$lib/controllers/keyboard'
  import { Midi } from '$lib/controllers/midi'
  import { EventEmitter } from '$lib/common/event-emitter'
  import Synth from '$components/instruments/Synth.svelte'

  const engine = new Engine()
  const keyboard = new Keyboard()
  const midi = new Midi()
  const noteEmitter: EventEmitter<controller.NoteEventMap> = new EventEmitter()

  keyboard.enable(noteEmitter)

  let controllerState: controller.State = {
    selectedController: 'keyboard',
    keyboardStatus: 'playing'
  }

  onMount(async () => {
    await engine.initialize()
  })

  const startAudio = async () => {
    await engine.startAudio()
  }

  const suspendAudio = async () => {
    noteEmitter.emit('stopAll')
    await engine.suspendAudio()
  }

  const render = (event: CustomEvent<{ channels: Channels }>) => {
    const { channels } = event.detail

    engine.render(channels)
  }

  const setController = (event: CustomEvent<{ controller: string }>) => {
    const { controller } = event.detail

    if (controller === 'MIDI') {
      keyboard.disable()
      midi.enable(noteEmitter)

      controllerState = {
        ...controllerState,
        selectedController: 'midi'
      }
    } else if (controller === 'Keyboard') {
      midi.disable()
      keyboard.enable(noteEmitter)

      controllerState = {
        ...controllerState,
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
      controllerState = {
        ...controllerState,
        keyboardStatus: 'typing'
      }
    } else {
      controllerState = {
        ...controllerState,
        keyboardStatus: 'playing'
      }
    }
  }
</script>

<div
  class="grid grid-flow-row auto-rows-max justify-center bg-neutral h-screen p-10 text-base-content"
>
  <Synth
    bind:controllerState={controllerState}
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
