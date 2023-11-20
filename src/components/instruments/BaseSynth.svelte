<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte'

  import type * as controller from '$lib/controllers'
  import type { EventEmitter } from '$lib/common/event-emitter'
  import type { NoteEventMap } from '$lib/controllers'

  import {
    engineStore,
    midiInputs,
    midiStatus,
    theme,
    tuning
  } from '../../stores'
  import { translateToRange } from '$lib/common/utils'
  import { BaseSynth } from '$lib/instruments/base-synth'
  import Knob from '$components/controls/Knob.svelte'

  export let controllerState: controller.State
  export let noteEmitter: EventEmitter<NoteEventMap>

  const dispatch = createEventDispatcher()
  const synth = new BaseSynth({ gain: 0.6, panning: 0.5 })
  let gain: number = 60
  let panning: number = 0
  let selectedMidiInput
  let selectedTheme: string

  const unsubscribeTheme = theme.subscribe(val => {
    selectedTheme = val
  })

  const startAudio = () => {
    dispatch('startaudio')
  }

  const suspendAudio = () => {
    dispatch('suspendaudio')
  }

  const playNote = ({ midiNote }: { midiNote: number }): void => {
    if ($engineStore.elementaryReady) {
      dispatch('render', { channels: synth.playNote(midiNote) })
    }
  }

  const stopNote = ({ midiNote }: { midiNote: number }): void => {
    if ($engineStore.elementaryReady) {
      dispatch('render', { channels: synth.stopNote(midiNote) })
    }
  }

  const stopAllNotes = () => {
    if ($engineStore.elementaryReady) {
      dispatch('render', { channels: synth.stopAllNotes() })
    }
  }

  const setTuning = (event: Event) => {
    const { value: selectedTuning } = event.target as HTMLInputElement

    noteEmitter.emit('stopAll')
    tuning.set(selectedTuning)
  }

  const setController = (event: Event) => {
    const { value: controller } = event.target as HTMLInputElement

    dispatch('controller', { controller })
  }

  const setMidiInput = (event: Event) => {
    const { value: midiInput } = event.target as HTMLInputElement

    dispatch('midiinput', { midiInput })
  }

  const setTheme = (event: Event) => {
    const { checked } = event.target as HTMLInputElement

    if (checked) {
      theme.set('dark')
    } else {
      theme.set('light')
    }
  }

  const setPanning = (event: CustomEvent<{ value: number }>) => {
    const { value } = event.detail

    panning = value

    const panValue = translateToRange({
      num: panning,
      original: { min: -100, max: 100 },
      scaled: { min: synth.limits.panning.min, max: synth.limits.panning.max }
    })

    if ($engineStore.elementaryReady) {
      dispatch('render', { channels: synth.setPanning(panValue) })
    }
  }

  const setGain = (event: CustomEvent<{ value: number }>) => {
    const { value } = event.detail

    gain = value

    const gainValue = translateToRange({
      num: gain,
      original: { min: 0, max: 100 },
      scaled: { min: synth.limits.gain.min, max: synth.limits.gain.max }
    })

    if ($engineStore.elementaryReady) {
      dispatch('render', { channels: synth.setGain(gainValue) })
    }
  }

  $: {
    if (
      controllerState.selectedController === 'keyboard' &&
      controllerState.keyboardStatus === 'typing'
    ) {
      noteEmitter.emit('stopAll')
      removeEventListeners()
    } else {
      addEventListeners()
    }
  }

  const addEventListeners = (): void => {
    noteEmitter.on('play', playNote)
    noteEmitter.on('stop', stopNote)
    noteEmitter.on('stopAll', stopAllNotes)
  }

  const removeEventListeners = (): void => {
    noteEmitter.removeListener('play', playNote)
    noteEmitter.removeListener('stop', stopNote)
    noteEmitter.removeListener('stopAll', stopAllNotes)
  }

  addEventListeners()

  onDestroy(() => {
    removeEventListeners()
    unsubscribeTheme()
  })
</script>

<div class="card bg-base-100 shadow-xl" style="width: 900px">
  <div class="card-body">
    <div class="grid grid-flow-col grid-cols-[2fr_1fr] align-center pb-5">
      <h1 class="text-4xl" style="display: inline-block">
        Svelte Elementary Template
      </h1>
      <div
        class="grid grid-flow-col auto-cols-max content-center justify-end gap-2"
      >
        <span>Light</span>
        <input
          type="checkbox"
          class="toggle toggle-xs mt-1"
          checked={selectedTheme === 'dark'}
          on:change={setTheme}
        />
        <span>Dark</span>
      </div>
    </div>
    <div class="grid grid-flow-col grid-cols-[3fr_1fr]">
      <div class="grid grid-flow-col auto-cols-max gap-4 items-center">
        {#if $engineStore.context.state === 'running'}
          <button class="btn btn-primary" on:click={suspendAudio}>
            Suspend Audio
          </button>
        {:else}
          <button class="btn btn-primary" on:click={startAudio}>
            Start Audio
          </button>
        {/if}
        <select
          class="select w-full max-w-xs select-primary"
          on:change={setTuning}
        >
          <option disabled selected value="ED2-12">Tuning System</option>
          <option value="ED2-5">5-TET</option>
          <option value="ED2-7">7-TET</option>
          <option value="ED2-12">12-TET</option>
          <option value="ED2-17">17-TET</option>
          <option value="ED2-19">19-TET</option>
        </select>
        <select
          class="select w-full max-w-xs select-primary"
          on:change={setController}
        >
          <option>Keyboard</option>
          {#if $midiStatus !== 'unavailable'}
            <option>MIDI</option>
          {/if}
        </select>
        {#if $midiStatus === 'enabled'}
          <select
            class="select w-full max-w-xs select-primary"
            on:change={setMidiInput}
            bind:value={selectedMidiInput}
          >
            {#each $midiInputs as midiInput}
              <option value={midiInput}>{midiInput}</option>
            {/each}
          </select>
        {:else if $midiStatus === 'unavailable'}
          <div class="tooltip" data-tip="MIDI not available in this browser">
            <select disabled class="select w-full max-w-xs select-primary">
              <option disabled selected>MIDI Device</option>
            </select>
          </div>
        {:else}
          <select disabled class="select w-full max-w-xs select-primary">
            <option disabled selected>MIDI Device</option>
          </select>
        {/if}
      </div>
      <div
        class="grid grid-flow-col auto-cols-max gap-4 items-center justify-end"
      >
        <Knob
          id="pan"
          label="Pan"
          polarity="bipolar"
          value={panning}
          on:input={setPanning}
          on:paramfocus
        />
        <Knob
          id="gain"
          label="Gain"
          value={gain}
          on:input={setGain}
          on:paramfocus
        />
      </div>
    </div>
  </div>
</div>
