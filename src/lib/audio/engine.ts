import { el, type ElemNode } from '@elemaudio/core'
import { get } from 'svelte/store'
import WebRenderer from '@elemaudio/web-renderer'

import { engineStore } from '../../stores'

export type Channels = { left: ElemNode; right: ElemNode }

export class Engine {
  constructor() {
    const store = get(engineStore)
    const core = new WebRenderer()

    if (!store.context) {
      const context = new AudioContext()
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
      outputChannelCount: [2],
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

  render = (channels: Channels): void => {
    const { context, core, elementaryReady } = get(engineStore)

    if (elementaryReady && context.state === 'running') {
      const leftBlockedOut = el.dcblock(channels.left)
      const rightBlockedOut = el.dcblock(channels.right)

      core.render(leftBlockedOut, rightBlockedOut)

    }
  }
}