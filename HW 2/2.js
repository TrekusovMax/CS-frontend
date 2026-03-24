const instructions = {
  'SET A': 0,
  'PRINT A': 1,
  'IFN A': 2,
  RET: 3,
  'DEC A': 4,
  JMP: 5,
}

const program = [
  // Ставим значения аккумулятора
  instructions['SET A'],
  // В 10
  10,
  // Выводим значение на экран
  instructions['PRINT A'],
  // Если A равно 0
  instructions['IFN A'],
  // Программа завершается
  instructions['RET'],
  // И возвращает 0
  0,
  // Уменьшаем A на 1
  instructions['DEC A'],
  // Устанавливаем курсор выполняемой инструкции
  instructions['JMP'],
  // В значение 2
  2,
]

function execute(program) {
  let pointer = 0
  let variable = 0

  while (pointer < program.length) {
    switch (program[pointer]) {
      case 0:
        variable = program[++pointer]
        pointer++
        break
      case 1:
        console.log(variable)
        pointer++
        break
      case 2:
        if (variable === 0) {
          pointer += 2
          return program[pointer]
        }
        pointer += 3
        break
      case 4:
        variable--
        pointer++
        break
      case 5:
        pointer = program[++pointer]
        break
      default:
        throw new Error(`Unknown instruction: ${program[pointer]}`)
    }
  }
}

function execute2(program) {
  const state = {
    value: 0,
    pointer: 0,
    exitCode: undefined,
  }

  const read = () => program[state.pointer]
  const next = () => program[state.pointer + 1]

  const instructions = {
    0: () => {
      state.value = next()
      state.pointer += 2
    },

    1: () => {
      console.log(state.value)
      state.pointer++
    },

    2: () => {
      if (state.value === 0) {
        state.pointer++
      } else {
        state.pointer += 3
      }
    },

    3: () => {
      state.exitCode = next()
    },

    4: () => {
      state.value--
      state.pointer++
    },

    5: () => {
      state.pointer = next()
    },
  }

  while (state.exitCode !== 0 && state.pointer < program.length) {
    const code = read()

    if (!instructions[code]) {
      throw new Error(`Unknown code: ${code} at position ${state.pointer}`)
    }

    instructions[code]()
  }

  return state.exitCode
}

// Выведет в консоль
// 10
// 9
// 8
// 7
// 6
// 5
// 4
// 3
// 2
// 1
// 0
// И вернет 0
const result = execute(program)
console.log('Exit code: ', result)

const result2 = execute2(program)
console.log('Exit code: ', result2)
