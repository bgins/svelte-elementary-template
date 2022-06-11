import { get } from 'svelte/store'
import { tuning } from '../../stores'


export const tune = (midiNote: number): number => {
  const selectedTuning = get(tuning)

  const baseFrequency = 440
  const baseMidiNote = 69
  const divisions = getDivisions(selectedTuning)
  const frequency = baseFrequency * 2 ** ((midiNote - baseMidiNote) / divisions)

  return frequency
}

/**
 * Get the divisions of an octave for a tuning
 * 
 * Tunings are internally named by the number of divisions of 
 * a harmonic. For example, 12-tone equal temperament is named ED2-12:
 * 
 *   - ED is equal divisions
 *   - 2 is the second harmonic (the octave)
 *   - 12 is the number of divisions
 * 
 * This terminology is more precise that 12-TET but less familiar
 * to users.
 * 
 * @param tuning tuning name
 * @returns divisions of an octave
 */
const getDivisions = tuning => {
  switch (tuning) {
    case 'ED2-5':
      return 5

    case 'ED2-7':
      return 7

    case 'ED2-12':
      return 12

    case 'ED2-17':
      return 17

    case 'ED2-19':
      return 19


    default:
      return 12
  }
}