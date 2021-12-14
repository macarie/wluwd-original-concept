import { dequal } from 'dequal'
import { messageSymbols } from '@wluwd/common/message-symbols'

import { createTester } from './utils/create-tester.js'

const dequalCopy = dequal.bind(this)

const getType = (negated: boolean): 'negative' | 'affirmative' => (negated ? 'negative' : 'affirmative')

export const equalTo = createTester(dequalCopy, ({ args: [input, expected], createDiff, inspect, negated }) => ({
  message: messageSymbols[getType(negated)].equalTo,
  content: createDiff(inspect(input), inspect(expected)),
}))
