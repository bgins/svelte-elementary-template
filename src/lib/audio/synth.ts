import { el, resolve } from '@elemaudio/core'

import type { ElemNode } from '@elemaudio/core'
import type { Channels } from '$lib/audio/engine'
import { tune } from '$lib/tuning'


type Config = {
  gain: number
  panning: number
}

// Limits provide ranges that UI components should target
type Limits = {
  gain: { min: number; max: number }
  panning: { min: number; max: number }
}

type Voice = { gate: number; freq: number; key: string }

export class Synth {
  gain: number
  panning: number
  voices: Voice[] = []

  limits: Limits = {
    gain: { min: 0, max: 1 },
    panning: { min: 0, max: 1 }
  }

  constructor(config: Config) {
    this.gain = config.gain
    this.panning = config.panning
  }

  playNote = (midiNote: number): Channels => {
    this.voices = updateVoices(this.voices, midiNote).slice(-8)

    return synth(this.voices, this.gain, this.panning)
  }

  stopNote = (midiNote: number): Channels => {
    const key = `v${midiNote}`
    this.voices = this.voices.filter(voice => voice.key !== key)

    if (this.voices.length > 0) {
      return synth(this.voices, this.gain, this.panning)
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
      synth(this.voices, this.gain, this.panning) :
      silence()
  }

  setGain = (gainValue: number): Channels => {
    this.gain = gainValue

    return this.voices.length > 0 ?
      synth(this.voices, this.gain, this.panning) :
      silence()
  }
}

const synth = (voices: Voice[], gainValue: number, panValue: number): Channels => {
  const node = el.add(...voices.map(voice => synthVoice(voice)))
  const gainOut = gain(node, gainValue)

  return pan(gainOut, panValue)
}

function updateVoices(voices: Voice[], midiNote: number): Voice[] {
  const key = `v${midiNote}`
  const freq = tune(midiNote)

  console.log(`MIDI note: ${midiNote}`, `, Frequency: ${freq}`)

  return voices.filter(voice => voice.key !== key).concat({ gate: 1, freq, key })
}

const synthVoice = (voice: Voice): ElemNode => {
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

/**
 * Gain with exponential response curve over a 60dB dynamic range.
 * See https://www.dr-lex.be/info-stuff/volumecontrols.html#ideal2
 * 
 * @param node input node
 * @param gainValue gain value between 0 and 1
 * @returns node with gain applied
 */
const gain = (node: ElemNode, gainValue: number): ElemNode => {
  return el.mul(
    node,
    el.div(
      el.exp(el.mul(el.sm(el.const({ key: 'gain', value: gainValue })), 6.908)),
      1000
    )
  )
}

/**
 * Linear panning.
 *  
 * @param node input node
 * @param panVal pan value between 0 and 1
 * @returns node with pan applied
 */
const pan = (node: ElemNode, panVal: number): Channels => {
  const left = el.mul(el.sm(el.const({ key: 'leftPanValue', value: 1 - panVal })), node)
  const right = el.mul(el.sm(el.const({ key: 'rightPanValue', value: panVal })), node)

  return {
    left,
    right
  }
}
