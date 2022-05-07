<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte'

  import type { EventEmitter } from '$lib/common/event-emitter'
  import type { Config } from '$lib/instruments'

  import { audioStore, midiInputs, midiStatus, tuning } from '../../stores'
  import { BaseSynth } from '$lib/instruments/base-synth'
  import Knob from '$components/controls/Knob.svelte'

  export let config: Config
  export let noteEmitter: EventEmitter

  const dispatch = createEventDispatcher()
  const synth = new BaseSynth()

  const startAudio = () => {
    dispatch('startaudio')
  }

  const suspendAudio = () => {
    dispatch('suspendaudio')
  }

  const playNote = (midiNote: number): void => {
    if ($audioStore.elementaryReady) {
      dispatch('render', { node: synth.playNote(midiNote) })
    }
  }

  const stopNote = (midiNote: number): void => {
    if ($audioStore.elementaryReady) {
      dispatch('render', { node: synth.stopNote(midiNote) })
    }
  }

  const stopAllNotes = () => {
    if ($audioStore.elementaryReady) {
      dispatch('render', { node: synth.stopAllNotes() })
    }
  }

  const setTuning = (event: Event) => {
    const { value: selectedTuning } = event.target as HTMLInputElement

    noteEmitter.dispatchEvent('stopAll')
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

  const setValFromKnob = (event: CustomEvent<{ value: number }>) => {
    const { value } = event.detail
    console.log('knob value', value)
  }

  $: {
    if (
      config.selectedController === 'keyboard' &&
      config.keyboardStatus === 'typing'
    ) {
      noteEmitter.dispatchEvent('stopAll')
      removeEventListeners()
    } else {
      addEventListeners()
    }
  }

  const addEventListeners = (): void => {
    noteEmitter.addEventListener('play', playNote)
    noteEmitter.addEventListener('stop', stopNote)
    noteEmitter.addEventListener('stopAll', stopAllNotes)
  }

  const removeEventListeners = (): void => {
    noteEmitter.removeEventListener('play', playNote)
    noteEmitter.removeEventListener('stop', stopNote)
    noteEmitter.removeEventListener('stopAll', stopAllNotes)
  }

  addEventListeners()

  onDestroy(() => {
    removeEventListeners()
  })
</script>

<div class="card bg-base-100 shadow-xl" style="width: 950px">
  <div class="card-body">
    <div class="grid grid-flow-col align-center pb-6">
      <h1 class="text-4xl" style="display: inline-block">
        Svelte Elementary Template
      </h1>
    </div>
    <div class="grid grid-flow-row auto-rows-max gap-7">
      <div class="grid grid-flow-col auto-cols-max gap-4">
        {#if $audioStore.context.state === 'running'}
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
          <option value="ED2-8">8-TET</option>
          <option value="ED2-12">12-TET</option>
          <option value="ED2-13">13-TET</option>
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
          >
            {#each Object.keys($midiInputs) as midiInput}
              <option>{midiInput}</option>
            {/each}
          </select>
        {:else if $midiStatus === 'unavailable'}
          <div class="tooltip" data-tip="MIDI unavailable in this browser">
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
      <Knob
        id="knob-1"
        label="Detune"
        on:input={setValFromKnob}
        on:paramfocus
      />
    </div>
  </div>
</div>
