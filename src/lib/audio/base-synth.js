import { ElementaryWebAudioRenderer as core, el } from '@elemaudio/core-lite';

export const baseSynth = (voices) => {
  return el.add(voices.map(voice => {
    return core.createNode(core.memo(synthVoice), { voice }, [])
  }))
}

const synthVoice = ({ props }) => {
  const { voice } = props

  return el.mul(
    el.const({ key: `${voice.key}:gate`, value: voice.gate }),
    el.cycle(el.const({ key: `${voice.key}:freq`, value: voice.freq }))
  )
}
