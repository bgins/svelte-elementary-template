export type State = {
  selectedController: 'keyboard' | 'midi' | 'none'
  keyboardStatus: 'playing' | 'typing'
}

export interface NoteEventMap {
  play: { midiNote: number }
  stop: { midiNote: number }
  stopAll: undefined
}