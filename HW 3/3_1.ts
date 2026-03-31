abstract class BCD {
  // Можно усложнить и сделать поддержку number | bigint
  constructor(num: number | bigint) {}

  abstract toBigint(): bigint
  abstract toNumber(): number
  abstract toString(): string

  // Возвращает значение разряда BCD числа на указанной позиции.
  // Отрицательная позиция означает разряд "с конца".
  abstract at(index: number): number
}

class PackedBCD extends BCD {
  protected numArray: Uint8Array
  protected length: number

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
    const digits = []
    if (num === 0) {
      digits.push(0)
    } else {
      let n = num
      while (n > 0) {
        digits.push(Number(n) % 10)
        n = Math.floor(Number(n) / 10)
      }
      digits.reverse()
    }

    this.length = Math.ceil(digits.length / 2)

    this.numArray = new Uint8Array(this.length)

    for (let i = 0; i < digits.length; i++) {
      const firstDigit = digits[i * 2]
      const secondDigit = digits[i * 2 + 1]
      this.numArray[i] =
        typeof secondDigit !== 'undefined' ? (firstDigit << 4) | secondDigit : firstDigit
    }
  }

  toBigint(): bigint {
    let result = ''
    const binaryNumber = this.toString()
    for (let i = 0; i < binaryNumber.length; i += 8) {
      const digitBinary = binaryNumber.slice(i, i + 8)
      const digit = parseInt(digitBinary, 2)

      result += digit.toString()
    }
    if (this.numArray[this.length - 1] % 10 == 0) {
      result = result.slice(0, -1)
    }
    return BigInt(result)
  }

  toNumber(): number {
    let result = []

    for (let i = 0; i < this.numArray.byteLength; i++) {
      if (Math.floor(Number(this.numArray[i]) / 10) != 0) {
        result.push(this.numArray[i] >> 4)
      }
      result.push(this.numArray[i] & 0b00001111)
    }

    return Number(result.join(''))
  }

  toString(): string {
    const result: string[] = []
    for (let i = 0; i < this.length; i++) {
      const byte = this.numArray[i]
      result.push(byte.toString(2).padStart(8, '0'))
    }
    return result.join('')
  }

  at(index: number): number {
    const num = this.toNumber().toString()
    let result = undefined
    if (index >= 0) {
      result = Number(num[index])
    } else {
      const idx = num.length + index
      result = Number(num[idx])
    }
    return Number(result)
  }
}

const n = new PackedBCD(12345)

console.log(n.toBigint()) // 18525n
console.log(n.toNumber()) // 12345
console.log(n.toString()) // "000100100011010000000101"

console.log(n.at(0)) // 1
console.log(n.at(1)) // 2

console.log(n.at(-1)) // 5
console.log(n.at(-2)) // 4
