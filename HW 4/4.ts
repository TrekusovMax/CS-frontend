function formatBinary(num: string, groupSize: number = 8): string {
  let result = ''
  for (let i = 0; i < num.length; i++) {
    if (i % groupSize == 0 && i > 0) {
      result += '_'
    }
    result += num[i]
  }
  return result
}

function cyclicLeftShift(num: number, shift: number) {
  if (shift === 0) {
    return `0b${formatBinary(num.toString(2))}`
  }
  const LENGTH = num.toString(2).length
  const result = ((num << shift) | (num >>> (LENGTH - shift)))
    .toString(2)
    .padStart(LENGTH, '0')

  return `0b${formatBinary(result)}`
}
function cyclicRightShift(num: number, shift: number) {
  if (shift === 0) {
    return `0b${formatBinary(num.toString(2))}`
  }
  const LENGTH = num.toString(2).length
  const result = ((num >>> shift) | (num << (LENGTH - shift)))
    .toString(2)
    .padStart(LENGTH, '0')

  return `0b${formatBinary(result)}`
}

console.log(cyclicLeftShift(0b10000000_00000000_00000000_00000001, 1))
console.log(cyclicRightShift(0b10000000_00000000_00000000_00000001, 2))
console.log(cyclicLeftShift(0b10000000_00000001_10000000_00000001, 0))
console.log(cyclicRightShift(0b10000000_00000001_10000000_00000001, 0))
console.log('_'.repeat(50))

console.assert(
  cyclicLeftShift(0b10000000_00000000_00000000_00000001, 16) ===
    cyclicRightShift(0b10000000_00000000_00000000_00000001, 16),
  'Сдвиг на 16 битов должен возвращать исходное число',
)
