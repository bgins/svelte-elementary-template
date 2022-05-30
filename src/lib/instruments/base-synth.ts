import { createNode, el, resolve } from '@elemaudio/core'

import { updateVoices } from '$lib/instruments'

import type { NodeRepr_t } from '@elemaudio/core'
import type { Channels, Voice } from '$lib/instruments'


export type BaseSynthConfig = {
  panning: number
}

export type BaseSynthLimits = {
  panning: { min: number; max: number }
}


export class BaseSynth {
  panning: number
  voices: Voice[] = []

  limits: BaseSynthLimits = {
    panning: { min: 0, max: 1 }
  }

  constructor(config: BaseSynthConfig) {
    this.panning = config.panning
  }

  playNote = (midiNote: number): Channels => {
    this.voices = updateVoices(this.voices, midiNote).slice(-8)

    return baseSynth(this.voices, this.panning)
  }

  stopNote = (midiNote: number): Channels => {
    const key = `v${midiNote}`
    this.voices = this.voices.filter(voice => voice.key !== key)

    if (this.voices.length > 0) {
      return baseSynth(this.voices, this.panning)
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
      baseSynth(this.voices, this.panning) :
      silence()
  }

}

const baseSynth = (voices: Voice[], panVal: number): Channels => {
  const node = el.add(...voices.map(voice => {
    return createNode(synthVoice, { voice }, [])
  }))

  return pan(node, panVal)
}

const pan = (node: NodeRepr_t | number, panVal: number): Channels => {
  const left = el.mul(el.sm(el.const({ key: 'leftPanValue', value: 1 - panVal })), node)
  const right = el.mul(el.sm(el.const({ key: 'rightPanValue', value: panVal })), node)

  return {
    left,
    right
  }
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