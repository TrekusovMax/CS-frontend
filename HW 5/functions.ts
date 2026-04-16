export function rowMajor(x: number, y: number, cb: () => void): void {
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      cb()
    }
  }
}

export function columnMajor(x: number, y: number, cb: () => void): void {
  for (let i = 0; i < y; i++) {
    for (let j = 0; j < x; j++) {
      cb()
    }
  }
}
