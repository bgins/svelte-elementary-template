<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { theme } from '../../stores'

  export let id: string
  export let label: string
  export let polarity: 'unipolar' | 'bipolar' = 'unipolar'
  export const defaultValue = polarity === 'unipolar' ? 50 : 0
  export let value: number = defaultValue
  export let step: number = 1
  export let min: number = polarity === 'unipolar' ? 0 : -100
  export let max: number = polarity === 'unipolar' ? 100 : 100

  const dispatch = createEventDispatcher()

  const setKnobSource = (theme: string) =>
    theme === 'light'
      ? `knobs/${polarity}-dark-knob.png`
      : `knobs/${polarity}-light-knob.png`

  let knobSource = setKnobSource($theme)

  const setValue = (event: { type: string; target: HTMLInputElement }) => {
    const { value: val } = event.target

    value = +val

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

  const setDefaultValue = () => {
    const value = defaultValue

    dispatch('input', { value })
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

  $: {
    knobSource = setKnobSource($theme)
  }
</script>

<div class="knob-group">
  <label for={id} class="text-sm">{label}</label>
  <webaudio-knob
    {id}
    src={knobSource}
    {value}
    {step}
    {min}
    {max}
    on:input={setValue}
    on:change={setValue}
    on:dblclick={setDefaultValue}
  />
  <webaudio-param
    link={id}
    {value}
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
