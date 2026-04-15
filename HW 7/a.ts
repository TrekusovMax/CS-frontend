class StringBuffer {
  buffer: ArrayBuffer
  decoder: TextDecoder
  count: number
  _index: Uint32Array

  constructor(buffer: ArrayBuffer) {
    this.buffer = buffer
    this.decoder = new TextDecoder()

    const view = new DataView(buffer)
    const count = view.getUint32(0, true)

    this.count = count

    const index = new Uint32Array(count * 2)
    let pos = 4
    for (let i = 0; i < count; i++) {
      const byteLen = view.getUint32(pos, true)
      pos += 4
      index[i * 2] = pos // dataOffset — предвычислен, как у меня
      index[i * 2 + 1] = byteLen // byteLen    — предвычислен, как у меня
      pos += byteLen
    }
    this._index = index
  }

  at(index: number) {
    const count = this.count
    let i = index < 0 ? count + index : index
    if (i < 0 || i >= count) return undefined

    const offset = this._index[i * 2]
    const byteLen = this._index[i * 2 + 1]
    return this.decoder.decode(
      new Uint8Array(this.buffer, offset, byteLen),
    )
  }

  toArray() {
    const { count, _index, decoder, buffer } = this
    const result = new Array(count)
    for (let i = 0; i < count; i++) {
      result[i] = decoder.decode(
        new Uint8Array(buffer, _index[i * 2], _index[i * 2 + 1]),
      )
    }
    return result
  }

  static encode(strings: string[]): StringBuffer {
    const encoder = new TextEncoder()
    const count = strings.length

    const encoded = new Array(count)
    let totalSize = 4
    for (let i = 0; i < count; i++) {
      const bytes = encoder.encode(strings[i])
      encoded[i] = bytes
      totalSize += 4 + bytes.length
    }

    const buffer = new ArrayBuffer(totalSize)
    const view = new DataView(buffer)
    view.setUint32(0, count, true) // little-endian

    let pos = 4
    for (let i = 0; i < count; i++) {
      const bytes = encoded[i]
      view.setUint32(pos, bytes.length, true)
      pos += 4
      new Uint8Array(buffer, pos, bytes.length).set(bytes)
      pos += bytes.length
    }

    return new StringBuffer(buffer)
  }

  static decode(buf: StringBuffer): string[] {
    return buf.toArray()
  }
}

const strings = ['hello', 'мир', '']
const buffer = StringBuffer.encode(strings)

console.log(buffer.at(0)) // "hello"
console.log(buffer.at(1)) // "мир"
console.log(buffer.at(-1)) // ""
console.log(buffer.at(99)) // undefined

const decoded = StringBuffer.decode(buffer) // ["hello", "мир", ""]
console.log(decoded)
