import type { PixelStream, RGBA } from './types.ts'

enum TraverseMode {
  RowMajor,
  ColMajor,
}

class StreamArrayOfArrays implements PixelStream {
  x: number
  y: number
  array: RGBA[][]

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.array = Array.from({ length: x }, () => Array.from({ length: y }))
  }

  fill() {
    for (let i = 0; i < this.x; i++) {
      for (let j = 0; j < this.y; j++) {
        this.array[i][j] = [
          Math.floor(Math.random() * 255),
          Math.floor(Math.random() * 255),
          Math.floor(Math.random() * 255),
          Number(Math.random().toFixed(3)),
        ]
      }
    }
  }

  getPixel(x: number, y: number): RGBA {
    return this.array[x][y]
  }

  setPixel(x: number, y: number, rgba: RGBA): RGBA {
    this.array[x][y] = rgba
    return this.array[x][y]
  }

  /* forEach(
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
    const iterations = 10
    //прогрев
    for (let i = 0; i < iterations; i++) {
      for (let j = 0; j < iterations; j++) {
        this.forEach(TraverseMode.RowMajor, () => {
          this.getPixel(i, j)
        })
      }
    }

    const start = performance.now()
    const modes = [TraverseMode.RowMajor, TraverseMode.ColMajor] as const
    for (const mode of modes) {
      for (let i = 0; i < this.x; i++) {
        for (let j = 0; j < this.y; j++) {
          this.forEach(mode, () => {
            this.getPixel(i, j)
          })
        }
      }
    }
    const end = performance.now()
    return `Size: ${size * size},  Time: ${Math.round(end - start) / iterations} ms`
  } */
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

//let testArrayOfArrays: string[] = []

for (const size of sizes) {
  const arrayOfArrays = new StreamArrayOfArrays(size, size)
  arrayOfArrays.fill()
  arrayOfArrays.test(size)
  //testArrayOfArrays.push(arrayOfArrays.test(size))
}
//export { testArrayOfArrays }
