import { RingBuffer } from './RingBuffer.ts'

export const sizes = [10, 100, 1000, 100_000]
export const iterations = 100_000

function pushBench(arr: number[]) {
  //PUSH
  const start = performance.now()
  for (let i = 0; i < iterations; i++) {
    arr.push(i)
  }
  const end = performance.now() - start
  return end
}
function popBench(arr: number[]) {
  //POP
  const start = performance.now()
  for (let i = 0; i < iterations; i++) {
    arr.pop()
  }
  const end = performance.now() - start
  return end
}
function unshiftBench(arr: number[]) {
  //UNSHIFT
  const start = performance.now()
  for (let i = 0; i < iterations; i++) {
    arr.unshift(i)
  }
  const end = performance.now() - start
  return end
}
function shiftBench(arr: number[]) {
  //SHIFT
  const start = performance.now()
  for (let i = 0; i < iterations; i++) {
    arr.shift()
  }
  const end = performance.now() - start
  return end
}

for (const size of sizes) {
  const arr: RingBuffer = new RingBuffer(size)
  const arr_holey: number[] = []

  for (let i = 0; i < size; i++) {
    // Random array filling
    const random = Math.random() < 0.5 ? 0 : 1
    if (random) {
      arr_holey[i] = 0
    }
  }

  //прогрев
  for (let i = 0; i < size; i++) {
    arr._buffer[i] = 0
  }

  const avarangeTimePush = pushBench(arr._buffer).toFixed(3)
  console.log(`Push operation for ${size} elements: ${avarangeTimePush}`)

  const avarangeTimePushHoley = pushBench(arr_holey).toFixed(3)
  console.log(`Push operation holey array for ${size} elements: ${avarangeTimePushHoley}`)
  console.log('------------------------------')

  const avarangeTimePop = popBench(arr._buffer).toFixed(3)
  console.log(`Pop operation for ${size} elements: ${avarangeTimePop}`)

  const avarangeTimePopHoley = popBench(arr_holey).toFixed(3)
  console.log(`Pop operation holey array for ${size} elements: ${avarangeTimePopHoley}`)
  console.log('------------------------------')

  const avarangeTimeUnshift = unshiftBench(arr._buffer).toFixed(3)
  console.log(`Unshift operation for ${size} elements: ${avarangeTimeUnshift}`)

  const avarangeTimeUnshiftHoley = unshiftBench(arr_holey).toFixed(3)
  console.log(`Unshift operation holey array for ${size} elements: ${avarangeTimeUnshiftHoley}`)
  console.log('------------------------------')

  const avarangeTimeShift = unshiftBench(arr._buffer).toFixed(3)
  console.log(`Shift operation for ${size} elements: ${avarangeTimeShift}`)

  const avarangeTimeShiftHoley = unshiftBench(arr_holey).toFixed(3)
  console.log(`Shift operation holey array for ${size} elements: ${avarangeTimeShiftHoley}`)
  console.log('------------------------------')
}
