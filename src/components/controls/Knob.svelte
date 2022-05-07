<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let id: string
  export let label: string
  export let min: number = 0
  export let max: number = 100

  const dispatch = createEventDispatcher()

  const setValue = (event: { type: string; target: HTMLInputElement }) => {
    const { value } = event.target

    switch (event.type) {
      case 'input':
        dispatch('input', { value })
        break

      case 'change':
        dispatch('change', { value })
        break

      default:
        break
    }
  }

  const setParamFocus = (event: { type: string; target: HTMLInputElement }) => {
    switch (event.type) {
      case 'focus':
        dispatch('paramfocus', { focused: true })
        break

      case 'blur':
        dispatch('paramfocus', { focused: false })
        break

      default:
        break
    }
  }
</script>

<div class="knob-group">
  <label for={id} class="text-sm">{label}</label>
  <webaudio-knob
    {id}
    src="knobs/knob.png"
    {min}
    {max}
    on:input={setValue}
    on:change={setValue}
  />
  <webaudio-param
    link={id}
    width="32"
    height="18"
    fontsize="11"
    on:focus={setParamFocus}
    on:blur={setParamFocus}
  />
</div>

<style>
  .knob-group {
    display: grid;
    grid-template-rows: auto auto;
    gap: 5px;
    width: 3rem;
    justify-items: center;
  }
</style>
