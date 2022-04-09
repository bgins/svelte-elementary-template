import type { NodeRepr_t } from '@elemaudio/core'
import type { Voice } from './audio'

import { createNode, el, resolve } from '@elemaudio/core'


type SynthVoiceProps = {
  voice: Voice
  partials: number[]
  gains: number[]
}


export const baseSynth = (voices: Voice[]): number | NodeRepr_t => {
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
