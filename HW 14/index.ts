interface User {
  age: number
  name: string
}

function isUserArray(arr: number[] | User[]): arr is User[] {
  return arr.length > 0 && typeof arr[0] === 'object'
}

const ages = [12, 42, 42, 42, 56]

const users: User[] = [
  { age: 12, name: 'Bob' },
  { age: 42, name: 'Ben' },
  { age: 42, name: 'Jack' },
  { age: 42, name: 'Sam' },
  { age: 56, name: 'Bill' },
]

function binarySearch(arr: number[], target: number, fromEnd?: boolean): number {
  let left = fromEnd ? arr.length - 1 : 0
  let right = fromEnd ? 0 : arr.length - 1

  let index = undefined
  if (!fromEnd) {
    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2)
      if (arr[mid] !== undefined) {
        if (arr[mid] === target) {
          if (index === undefined) {
            index = mid
          }
          if (mid < index) {
            index = mid
          }
        }
        if (arr[mid] < target) {
          left = mid + 1
        } else {
          right = mid - 1
        }
      }
    }
  } else {
    while (left >= right) {
      const mid = right + Math.floor((left - right) / 2)
      if (arr[mid] !== undefined) {
        if (arr[mid] === target) {
          if (index === undefined) {
            index = mid
          }
          if (mid > index) {
            index = mid
          }
        }
        if (arr[mid] > target) {
          left = mid - 1
        } else {
          right = mid + 1
        }
      }
    }
  }

  return index !== undefined ? index : -1
}

function indexOf(obj: User[] | number[], value: number, cb?: (item: User) => number) {
  if (cb) {
    if (isUserArray(obj)) return binarySearch(obj.map(cb), value)
  } else {
    return !isUserArray(obj) && binarySearch(obj, value)
  }
}
function lastIndexOf(obj: User[] | number[], value: number, cb?: (item: User) => number) {
  if (cb) {
    if (isUserArray(obj)) return binarySearch(obj.map(cb), value, true)
  } else {
    return !isUserArray(obj) && binarySearch(obj, value, true)
  }
}

// Поиск по массиву чисел
console.log(indexOf(ages, 42)) // 1
console.log(lastIndexOf(ages, 42)) // 3

// Поиск по массиву объектов (по полю age)
console.log(indexOf(users, 42, (item) => item.age)) // 1
console.log(lastIndexOf(users, 42, (item) => item.age)) // 3

// Не найдено
console.log(indexOf(ages, 100)) // -1
console.log(lastIndexOf(ages, 100)) // -1
