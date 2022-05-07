import { el } from '@elemaudio/core'
import { get } from 'svelte/store'
import WebRenderer from '@elemaudio/web-renderer-lite'

import { audioStore } from '../../stores'

import type { NodeRepr_t } from '@elemaudio/core'

export class Engine {
  constructor() {
    const store = get(audioStore)
    const core = new WebRenderer()

    if (!store.context) {
      const context = new window.AudioContext()

      audioStore.update(store => ({
        ...store,
        context,
        contextState: 'suspended',
        core
      }))
      void context.suspend()
    }

    core.on('load', function () {
      audioStore.update(store => ({ ...store, elementaryReady: true }))
    })
  }

  initialize = async (): Promise<void> => {
    const { context, core } = get(audioStore)

    const node = await core.initialize(context, {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [3],
    })

    node.connect(context.destination)
  }

  start = (): void => {
    const { context } = get(audioStore)

    void context.resume()
    audioStore.update(store => ({ ...store, contextState: 'running' }))
  }

  pause = (): void => {
    const { context } = get(audioStore)

    void context.suspend()
    audioStore.update(store => ({ ...store, contextState: 'suspended' }))
  }

  render = (ensemble: number | NodeRepr_t): void => {
    const { core } = get(audioStore)
    const dcblockOut = el.dcblock(ensemble)
    const gainOut = el.mul(dcblockOut, 3)

    core.render(gainOut, gainOut)
  }
}