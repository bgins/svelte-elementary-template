<script lang="ts">
  import { onMount } from 'svelte'

  import { Synth } from '$lib/audio/audio'
  import { Keyboard } from '$lib/controllers/keyboard'
  import { Midi } from '$lib/controllers/midi'
  import { EventEmitter } from '$lib/common/event-emitter'
  import {
    audioStore,
    midiInputs,
    midiStatus,
    tuning
  } from '../stores'

  const noteEmitter = new EventEmitter()
  const keyboard = new Keyboard()
  const midi = new Midi()
  const synth = new Synth()

  keyboard.enable(noteEmitter)

  onMount(async () => {
    await synth.initialize()
  })

  const startAudio = () => {
    synth.start(noteEmitter)
  }

  const pauseAudio = () => {
    synth.pause(noteEmitter)
  }

  const setTuning = event => {
    const { value: selectedTuning } = event.target as HTMLInputElement

    synth.stopAllNotes()
    tuning.set(selectedTuning)
  }

  const setController = event => {
    const { value: controller } = event.target as HTMLInputElement

    if (controller === 'MIDI') {
      keyboard.disable()
      midi.enable(noteEmitter)
    } else if (controller === 'Keyboard') {
      midi.disable()
      keyboard.enable(noteEmitter)
    }
  }

  const setMidiInput = event => {
    const { value: name } = event.target as HTMLInputElement

    midi.setInput(name)
  }
</script>

<div
  class="grid grid-flow-row auto-rows-max justify-center bg-neutral h-screen p-10 text-base-content"
>
  <div class="card bg-base-100 shadow-xl" style="width: 950px">
    <div class="card-body">
      <div class="grid grid-flow-col grid-cols-2 align-center pb-6">
        <h1 class="text-4xl" style="display: inline-block">
          Svelte Elementary Template
        </h1>
      </div>
        <div class="grid grid-flow-row auto-rows-max gap-7">
          <div class="grid grid-flow-col auto-cols-max gap-4">
            {#if $audioStore.contextState === 'running'}
              <button class="btn btn-primary" on:click={pauseAudio}>
                Pause Audio
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
        </div>

    </div>
  </div>
</div>

<style>
</style>
