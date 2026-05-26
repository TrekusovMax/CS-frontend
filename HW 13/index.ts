type Tkey = string | number | object

class HashMap {
  table: [Tkey, any][][]
  size: number
  lenght: number
  constructor(size = 10) {
    this.table = Array.from({ length: size }, () => [])
    this.size = size
    this.lenght = 0
  }

  hash(key: Tkey) {
    let h = 5381
    for (let i = 0; i < key.toString().length; i++)
      h = ((h << 5) + h) ^ key.toString().charCodeAt(i)
    return (h >>> 0) % this.size
  }

  set(key: Tkey, value: any) {
    // проверяем заполенность хэш-таблицы и при необходимости увеличиваем размер
    if (this.lenght / this.size > 0.75) {
      this.resize(this.size * 2)
    }

    const idx = this.hash(key)
    const chain = this.table[idx]
    const existing = chain!.find(([k]) => k === key)
    if (existing)
      existing[1] = value // обновить
    else {
      chain!.push([key, value]) //добавляем в список
      this.lenght++
    }
  }

  get(key: Tkey) {
    const chain = this.table[this.hash(key)]
    return chain!.find(([k]) => k === key)?.[1]
  }
  has(key: Tkey) {
    const chain = this.table[this.hash(key)]
    return !!chain!.find(([k]) => k === key)
  }
  delete(key: Tkey) {
    const idx = this.hash(key)
    const chain = this.table[idx]
    const existing = chain!.find(([k]) => k === key)
    if (existing) {
      chain!.splice(chain!.indexOf(existing), 1)
      this.lenght--
    }
    return existing ? existing[1] : undefined
  }
  resize(newSize: number) {
    //console.log(`Resizing from ${this.size} to ${newSize}`)
    const oldTable = this.table
    this.lenght = 0
    this.size = newSize
    this.table = Array.from({ length: newSize }, () => [])
    for (const chain of oldTable) {
      for (const [key, value] of chain) {
        this.set(key, value)
      }
    }
  }
}

const map = new HashMap(5)
const document = {
  name: 'doc',
}

map.set('foo', 1)
map.set(42, 10)
map.set('42', 10)
map.set(30, 50)
map.set(document, 100)

console.log(map.get(42)) // 10
console.log(map.has(document)) // true
console.log(map.delete(document)) // 100
console.log(map.has(document)) // false

console.log(map.table)
console.log(map.lenght)
