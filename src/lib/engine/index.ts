import { el } from '@elemaudio/core'
import { get } from 'svelte/store'
import WebRenderer from '@elemaudio/web-renderer-lite'

import { engineStore } from '../../stores'

import type { NodeRepr_t } from '@elemaudio/core'

export class Engine {
  constructor() {
    const store = get(engineStore)
    const core = new WebRenderer()

    if (!store.context) {
      const context = new window.AudioContext()
      void context.suspend()

      engineStore.update(store => ({
        ...store,
        context,
        core
      }))
    }

    core.on('load', function () {
      engineStore.update(store => ({ ...store, elementaryReady: true }))
    })
  }

  initialize = async (): Promise<void> => {
    const { context, core } = get(engineStore)

    const node = await core.initialize(context, {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [3],
    })

    node.connect(context.destination)
  }

  startAudio = async (): Promise<void> => {
    const { context } = get(engineStore)

    await context.resume()
    engineStore.update(store => ({ ...store, context }))
  }

  suspendAudio = async (): Promise<void> => {
    const { context } = get(engineStore)

    await context.suspend()
    engineStore.update(store => ({ ...store, context }))
  }

  render = (ensemble: number | NodeRepr_t): void => {
    const { context, core, elementaryReady } = get(engineStore)

    if (elementaryReady && context.state === 'running') {
      const dcblockOut = el.dcblock(ensemble)
      const gainOut = el.mul(dcblockOut, 3)

      core.render(gainOut, gainOut)
    }
  }
}