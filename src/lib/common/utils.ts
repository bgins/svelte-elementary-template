export const halve = <T>(array: T[]): { firstHalf: T[]; secondHalf: T[] } => {
  const half = Math.ceil(array.length / 2)
  const firstHalf = array.slice(0, half)
  const secondHalf = array.slice(-half)

  return { firstHalf, secondHalf }
}

export const translateToRange = ({ num, original, scaled }: {
  num: number
  original: { min: number; max: number }
  scaled: { min: number; max: number }
}): number => {
  return ((scaled.max - scaled.min) * (num - original.min)) / (original.max - original.min) + scaled.min
}