import { dequal } from 'dequal'

import { createTester } from './utils/create-tester.js'

const dequalCopy = dequal.bind(this)

export const equalTo = createTester(dequalCopy, ({ args: [input, expected], createDiff, inspect }) => ({
  message: 'It seems that `input` and `expected` are not deeply equal:',
  content: createDiff(inspect(input), inspect(expected)),
}))
