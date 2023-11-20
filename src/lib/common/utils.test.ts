import test from 'ava'

import { halve, translateToRange } from './utils'

test('halve evenly splits an array of numbers', t => {
  const { firstHalf, secondHalf } = halve([1,2,3,4])

  t.deepEqual(firstHalf, [1,2])
  t.deepEqual(secondHalf, [3,4])
})

test('halve assigns odd element to first half', t => {
  const { firstHalf, secondHalf } = halve([1,2,3,4,5])

  t.deepEqual(firstHalf, [1,2,3])
  t.deepEqual(secondHalf, [4,5])
})

test('translateToRange translates number to scaled range', t => {
  const scaled = translateToRange({num: 1, original: { min: 0, max: 2}, scaled: { min: 2, max: 4}})

  t.is(scaled, 3)
})