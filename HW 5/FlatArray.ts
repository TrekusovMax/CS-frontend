class FlatArray {
  width: number
  height: number
  array: number[]
  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.array = new Array(width * height * 4)
  }

  fill() {
    for (let i = 0; i < this.array.length; i++) {
      this.array[i] = Math.floor(Math.random() * 100)
    }
  }
  testFunction() {
    let sum = 0
    for (let i = 0; i < this.array.length; i++) {
      sum += this.array[i]
    }
    return sum
  }
  test(size: number) {
    const iterations = 10

    //прогрев
    for (let i = 0; i < iterations; i++) {
      this.testFunction()
    }

    const start = performance.now()
    for (let i = 0; i < iterations; i++) {
      this.testFunction()
    }
    const end = performance.now()
    return `Size: ${size * size * 4},  Time: ${Math.round(end - start) / iterations} ms`
  }
}

const sizes = [100, 200, 300, 400]
let testFlatArray: string[] = []

for (const size of sizes) {
  const flatArray = new FlatArray(size, size)
  flatArray.fill()
  testFlatArray.push(flatArray.test(size))
}
export { testFlatArray }
