export class RGBA {
  static BYTES_PER_ELEMENT = 4

  static get(bytes: Uint8Array, byteOffset: number) {
    return [bytes[byteOffset], bytes[byteOffset + 1], bytes[byteOffset + 2], bytes[byteOffset + 3]]
  }

  static set(bytes: Uint8Array, byteOffset: number, color: string | number[] | Uint8Array) {
    if (typeof color === 'string') {
      if (color.startsWith('#')) {
        color = color.slice(1)
      }

      const hex = /([0-9a-f])/gi

      switch (color.length) {
        // Короткая запись цвета
        case 3:
        case 4:
          color = color.replace(hex, '$1$1')
          break

        default:
          color = color.padEnd(8, 'F')
      }

      color = Buffer.from(color, 'hex')
    } else if ((!Array.isArray(color) && !ArrayBuffer.isView(color)) || color.length < 3) {
      throw new TypeError('Invalid argument')
    }

    bytes[byteOffset] = color[0]!
    bytes[byteOffset + 1] = color[1]!
    bytes[byteOffset + 2] = color[2]!
    bytes[byteOffset + 3] = color[3] ?? 255
  }

  get buffer() {
    return this.#bytes.buffer
  }

  get byteLength() {
    return this.#bytes.byteLength
  }

  get byteOffset() {
    return this.#byteOffset + this.#bytes.byteOffset
  }

  get BYTES_PER_ELEMENT() {
    return (this.constructor as typeof Uint8Array).BYTES_PER_ELEMENT
  }

  get hex() {
    return (
      '#' +
      Buffer.from(this.#bytes.subarray(this.#byteOffset, this.#byteOffset + 4))
        .toString('hex')
        .toUpperCase()
    )
  }

  get red() {
    return this.#bytes[this.#byteOffset]
  }

  set red(value) {
    this.#bytes[this.#byteOffset] = value!
  }

  get green() {
    return this.#bytes[this.#byteOffset + 1]
  }

  set green(value) {
    this.#bytes[this.#byteOffset + 1] = value!
  }

  get blue() {
    return this.#bytes[this.#byteOffset + 2]
  }

  set blue(value) {
    this.#bytes[this.#byteOffset + 2] = value!
  }

  get alpha() {
    return this.#bytes[this.#byteOffset + 3]
  }

  set alpha(value) {
    this.#bytes[this.#byteOffset + 3] = value!
  }

  #bytes: Uint8Array
  #byteOffset: number

  constructor(data: ArrayBuffer | ArrayBufferView, byteOffset: number = 0) {
    if (byteOffset >= data.byteLength) {
      throw new Error('byteOffset must be lower than data.byteLength')
    }

    this.#byteOffset = byteOffset

    if (data instanceof Uint8Array) {
      if (byteOffset >= data.length) {
        throw new Error('byteOffset must be lower than data.length')
      }

      this.#bytes = data
    } else if (ArrayBuffer.isView(data)) {
      const len = 'length' in data ? (data as Uint8Array).length : (data as DataView).byteLength
      if (len < 4) {
        throw new Error('Invalid data length')
      }

      if ('slice' in data) {
        this.#bytes = new Uint8Array((data as Uint8Array).slice(0, 4))
      } else {
        this.#bytes = new Uint8Array(data.buffer, data.byteOffset, 4)
      }
    } else {
      this.#bytes = new Uint8Array(data as ArrayBuffer, 0, 4)
    }
  }
}
