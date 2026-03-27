export abstract class BCD {
  // Можно усложнить и сделать поддержку number | bigint
  constructor(num: number | bigint) {}

  abstract toBigint(): bigint
  abstract toNumber(): number
  abstract toString(): string

  // Возвращает значение разряда BCD числа на указанной позиции.
  // Отрицательная позиция означает разряд "с конца".
  abstract at(index: number): number
}

class MyBCD extends BCD {
  protected numArray: Uint8Array

  constructor(num: number | bigint) {
    super(num)
    if (typeof num === 'number') {
      if (!Number.isInteger(num) || num < 0) {
        throw new Error('Число должно быть неотрицательным')
      }
    }
    if (num < 0n) {
      throw new Error('Число должно быть неотрицательным')
    }
    const numToStr = num.toString()
    this.numArray = new Uint8Array(numToStr.length)

    for (let i = 0; i < numToStr.length; i++) {
      this.numArray[i] = Number(numToStr[i])
    }
  }

  toBigint(): bigint {
    return BigInt(parseInt(this.toString(), 2))
  }

  toNumber(): number {
    return Number(Array.from(this.numArray).join(''))
  }
  toString(): string {
    return Array.from(this.numArray)
      .map((d) => d.toString(2).padStart(4, '0'))
      .join('')
  }

  at(index: number): number {
    if (index >= 0) {
      return this.numArray[index]
    } else {
      const idx = this.numArray.length + index
      return this.numArray[idx]
    }
  }
}

const n = new MyBCD(65536n)

console.log(n.toBigint()) // 415030n
console.log(n.toNumber()) // 65536
console.log(n.toString()) // "01100101010100110110"

console.log(n.at(0)) // 6
console.log(n.at(1)) // 5

console.log(n.at(-1)) // 6
console.log(n.at(-2)) // 3
