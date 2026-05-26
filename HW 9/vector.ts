class Vector<T> {
  private items: T[]
  private size: number
  private capacity: number

  constructor(initialCapacity: number = 10) {
    this.items = new Array<T>(initialCapacity)
    this.size = 0
    this.capacity = initialCapacity
  }

  // Добавить элемент в конец - O(1) амортизированная
  push(element: T): void {
    if (this.size >= this.capacity) {
      this._resize()
    }
    this.items[this.size] = element
    this.size++
  }

  // Получить элемент по индексу - O(1)
  get(index: number): T {
    if (index < 0 || index >= this.size) {
      throw new Error('Index out of bounds')
    }
    return this.items[index]!
  }

  // Установить элемент - O(1)
  set(index: number, element: T): void {
    if (index < 0 || index >= this.size) {
      throw new Error('Index out of bounds')
    }
    this.items[index] = element
  }

  // Удалить последний элемент - O(1)
  pop(): T {
    if (this.size === 0) {
      throw new Error('Vector is empty')
    }
    const element = this.items[this.size - 1]
    this.size--
    return element!
  }

  // Вставить элемент на позицию - O(n)
  insert(index: number, element: T): void {
    if (index < 0 || index > this.size) {
      throw new Error('Index out of bounds')
    }

    if (this.size >= this.capacity) {
      this._resize()
    }

    // Сдвигаем элементы вправо
    for (let i = this.size; i > index; i--) {
      this.items[i] = this.items[i - 1]!
    }

    this.items[index] = element
    this.size++
  }

  // Удалить элемент по индексу - O(n)
  remove(index: number): T {
    if (index < 0 || index >= this.size) {
      throw new Error('Index out of bounds')
    }

    const element = this.items[index]

    // Сдвигаем элементы влево
    for (let i = index; i < this.size - 1; i++) {
      this.items[i] = this.items[i + 1]!
    }

    this.size--
    return element!
  }

  // Получить текущий размер
  getSize(): number {
    return this.size
  }

  // Получить ёмкость
  getCapacity(): number {
    return this.capacity
  }

  // Проверить, пуст ли вектор
  isEmpty(): boolean {
    return this.size === 0
  }

  // Очистить вектор
  clear(): void {
    this.items = new Array<T>(this.capacity)
    this.size = 0
  }

  // Приватный метод: расширение ёмкости
  private _resize(): void {
    const newCapacity = Math.floor(this.capacity * 1.5)
    const newItems = new Array<T>(newCapacity)

    // Копируем старые элементы
    for (let i = 0; i < this.size; i++) {
      newItems[i] = this.items[i]!
    }

    this.items = newItems
    this.capacity = newCapacity

    console.log(`📊 Вектор расширен: ${newCapacity}`)
  }

  // Итератор для использования в циклах
  [Symbol.iterator](): Iterator<T> {
    let index = 0
    const items = this.items
    const size = this.size

    return {
      next: (): IteratorResult<T> => {
        if (index < size) {
          return { value: items[index++]!, done: false }
        }
        return { value: undefined, done: true }
      },
    }
  }

  // Красивый вывод
  toString(): string {
    return `[${Array.from(this).join(', ')}]`
  }
}

