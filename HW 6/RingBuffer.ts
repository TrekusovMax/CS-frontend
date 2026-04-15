export class RingBuffer {
  _buffer
  _tail = 0
  _head = 0
  _over = false

  constructor(len: number) {
    this._buffer = Array(len).fill(0)
  }

  get length() {
    return +this._over * this._buffer.length + this._tail - this._head
  }

  push(val: number) {
    if (this._tail === this._head && this._over) {
      // "хвост" догнал "с обратной стороны" - надо продвинуть и "голову"
      if (this._head++ === this._buffer.length) {
        this._head = 0
        this._over = false // при переходе "головы" флаг сбрасываем
      }
    }
    this._buffer[this._tail++] = val
    if (this._tail === this._buffer.length) {
      this._tail = 0
      this._over = true // при переходе "хвоста" флаг устанавливаем
    }
    return this.length
  }

  shift() {
    if (this._head !== this._tail || this._over) {
      const val = this._buffer[this._head++]
      if (this._head === this._buffer.length) {
        this._head = 0
        this._over = false // при переходе "головы" флаг сбрасываем
      }
      return val
    }
  }
}
