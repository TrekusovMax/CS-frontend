import type { PixelStream, RGBA } from './types.ts'

enum TraverseMode {
  RowMajor,
  ColMajor,
}

class StreamArrayOfObjects implements PixelStream {
  x: number
  y: number
  array: { r: RGBA[0]; g: RGBA[1]; b: RGBA[2]; a: RGBA[3] }[][]

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.array = Array.from({ length: x }, () => Array.from({ length: y }))
  }

  fill() {
    for (let i = 0; i < this.x; i++) {
      for (let j = 0; j < this.y; j++) {
        this.array[i][j] = {
          r: Math.floor(Math.random() * 255),
          g: Math.floor(Math.random() * 255),
          b: Math.floor(Math.random() * 255),
          a: Number(Math.random().toFixed(3)),
        }
      }
    }
  }

  getPixel(x: number, y: number): any {
    return this.array[x][y]
  }

  setPixel(x: number, y: number, rgba: RGBA): RGBA {
    this.array[x][y] = { r: rgba[0], g: rgba[1], b: rgba[2], a: rgba[3] }
    return [
      this.array[x][y]['r'],
      this.array[x][y]['g'],
      this.array[x][y]['b'],
      this.array[x][y]['a'],
    ]
  }

  forEach(
    mode: TraverseMode,
    callback: (rgba: RGBA, x: number, y: number) => void,
  ): void {
    if (mode === TraverseMode.RowMajor) {
      for (let i = 0; i < this.x; i++) {
        for (let j = 0; j < this.y; j++) {
          const rgba = this.getPixel(i, j)
          callback(rgba, i, j)
        }
      }
    } else {
      for (let i = 0; i < this.y; i++) {
        for (let j = 0; j < this.x; j++) {
          const rgba = this.getPixel(j, i)
          callback(rgba, j, i)
        }
      }
    }
  }

  test(size: number) {
    console.log(`Array size: ${size}`)

    const iterations = 10
    //прогрев
    for (let i = 0; i < iterations; i++) {
      for (let j = 0; j < iterations; j++) {
        this.getPixel(i, j)
      }
    }

    const rowStart = performance.now()

    for (let i = 0; i < iterations; i++) {
      this.forEach(TraverseMode.RowMajor, () => {})
    }
    const rowTime = (performance.now() - rowStart) / iterations

    const colStart = performance.now()

    for (let i = 0; i < iterations; i++) {
      this.forEach(TraverseMode.ColMajor, () => {})
    }
    const colTime = (performance.now() - colStart) / iterations

    const ratio = (colTime / rowTime).toFixed(2)

    console.log(`По строкам: ${rowTime.toFixed(2)} ms`)
    console.log(`По столбцам: ${colTime.toFixed(2)} ms`)
    console.log(`Разница: ${ratio}x медленнее \n`)
  }
}

const sizes = [1000, 2000, 3000, 4000, 5000]

//let testArrayOfObjects: string[] = []

for (const size of sizes) {
  const arrayOfObjects = new StreamArrayOfObjects(size, size)
  arrayOfObjects.fill()
  //testArrayOfObjects.push(arrayOfObjects.test(size))
  arrayOfObjects.test(size)
}
//console.log(testArrayOfObjects)
//export { testArrayOfObjects }
