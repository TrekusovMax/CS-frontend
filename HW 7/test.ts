const User = {
  name: {
    bytes: 4,
  },
  age: {
    bytes: 1,
  },
}

const data = new ArrayBuffer(10) // Размер указывается в байтах

const size = User.age.bytes + User.name.bytes
function getUserAge(buffer: ArrayBuffer, offset = 0) {
  return new Uint8Array(buffer, offset)[0]
}
function setUserAge(age: number, buffer: ArrayBuffer, offset = 0) {
  new Uint8Array(buffer, offset)[0] = age
}
function getUserName(buffer: ArrayBuffer, offset = 0) {
  return new TextDecoder().decode(new Uint8Array(buffer, offset + User.age.bytes, User.name.bytes))
}
function setUserName(name: string, buffer: ArrayBuffer, offset = 0) {
  new TextEncoder().encodeInto(
    name,
    new Uint8Array(buffer, offset + User.age.bytes, User.name.bytes),
  )
}

const from = [
  { age: 42, name: 'Bob' },
  { age: 10, name: 'Ben' },
]
for (let i = 0; i < from.length; i++) {
  setUserAge(from[i].age, data, i * size)
  setUserName(from[i].name, data, i * size)
}
console.log(data)
console.log(size)
console.log(getUserAge(data, 0 * size))
console.log(getUserName(data, 0 * size))
console.log(getUserAge(data, 1 * size))
console.log(getUserName(data, 1 * size))
