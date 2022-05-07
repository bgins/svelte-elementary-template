import { createNode, el, resolve } from '@elemaudio/core'

import { updateVoices } from '$lib/instruments'

import type { NodeRepr_t } from '@elemaudio/core'
import type { Voice } from '$lib/instruments'

type SynthVoiceProps = {
  voice: Voice
}

export class BaseSynth {
  voices: Voice[] = []

  playNote = (midiNote: number): number | NodeRepr_t => {
    this.voices = updateVoices(this.voices, midiNote).slice(-8)

    return baseSynth(this.voices)
  }

  stopNote = (midiNote: number): number | NodeRepr_t => {
    const key = `v${midiNote}`
    this.voices = this.voices.filter(voice => voice.key !== key)

    if (this.voices.length > 0) {
      return baseSynth(this.voices)
    } else {
      return el.const({ key: 'silence', value: 0 })
    }
  }

  stopAllNotes = (): number | NodeRepr_t => {
    this.voices = []

    return el.const({ key: 'silence', value: 0 })
  }

}

const baseSynth = (voices: Voice[]): number | NodeRepr_t => {
  return el.add(...voices.map(voice => {
    return createNode(synthVoice, { voice }, [])
  }))
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
