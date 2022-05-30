import { createNode, el, resolve } from '@elemaudio/core'

import { updateVoices } from '$lib/instruments'

import type { NodeRepr_t } from '@elemaudio/core'
import type { Channels, Voice } from '$lib/instruments'


export type BaseSynthConfig = {
  gain: number
  panning: number
}

export type BaseSynthLimits = {
  gain: { min: number; max: number }
  panning: { min: number; max: number }
}


export class BaseSynth {
  gain: number
  panning: number
  voices: Voice[] = []

  limits: BaseSynthLimits = {
    gain: { min: 0, max: 1 },
    panning: { min: 0, max: 1 }
  }

  constructor(config: BaseSynthConfig) {
    this.gain = config.gain
    this.panning = config.panning
  }

  playNote = (midiNote: number): Channels => {
    this.voices = updateVoices(this.voices, midiNote).slice(-8)

    return baseSynth(this.voices, this.gain, this.panning)
  }

  stopNote = (midiNote: number): Channels => {
    const key = `v${midiNote}`
    this.voices = this.voices.filter(voice => voice.key !== key)

    if (this.voices.length > 0) {
      return baseSynth(this.voices, this.gain, this.panning)
    } else {
      return silence()
    }
  }

  stopAllNotes = (): Channels => {
    this.voices = []

    return silence()
  }

  setPanning = (panValue: number): Channels => {
    this.panning = panValue

    return this.voices.length > 0 ?
      baseSynth(this.voices, this.gain, this.panning) :
      silence()
  }

  setGain = (gainValue: number): Channels => {
    this.gain = gainValue

    return this.voices.length > 0 ?
      baseSynth(this.voices, this.gain, this.panning) :
      silence()
  }
}

const baseSynth = (voices: Voice[], gainValue: number, panValue: number): Channels => {
  const node = el.add(...voices.map(voice => {
    return createNode(synthVoice, { voice }, [])
  }))
  const gainOut = gain(node, gainValue)

  return pan(gainOut, panValue)
}


type SynthVoiceProps = {
  voice: Voice
}

const synthVoice = ({ props }): NodeRepr_t => {
  const { voice } = props as SynthVoiceProps

  return resolve(
    el.mul(
      el.const({ key: `${voice.key}:gate`, value: voice.gate }),
      el.cycle(el.const({ key: `${voice.key}:freq`, value: voice.freq }))
    )
  )
}

const silence = (): Channels => {
  return {
    left: el.const({ key: 'silence', value: 0 }),
    right: el.const({ key: 'silence', value: 0 })
  }
}

const gain = (node: NodeRepr_t | number, gainValue: number): NodeRepr_t | number => {
  return el.mul(
    node,
    el.div(
      el.exp(el.mul(el.sm(el.const({ key: 'gain', value: gainValue })), 11.51)),
      10000
    )
  )
}

const pan = (node: NodeRepr_t | number, panVal: number): Channels => {
  const left = el.mul(el.sm(el.const({ key: 'leftPanValue', value: 1 - panVal })), node)
  const right = el.mul(el.sm(el.const({ key: 'rightPanValue', value: panVal })), node)

  return {
    left,
    right
  }
}
