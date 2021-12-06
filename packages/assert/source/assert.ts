import { resultOrError } from './utils/result-or-error.js'

import type { Expect } from './types/expect.js'

export const expect = <ValueType>(value: ValueType): Expect<ValueType> => {
  const to: Expect<ValueType>['to'] = (tester, ...args) =>
    resultOrError({
      result: tester(value, ...args),
      origin: to,
      input: value,
      expected: args[0],
    })

  const not: Expect<ValueType>['to']['not'] = (tester, ...args) =>
    resultOrError({
      result: !tester(value, ...args),
      origin: to,
      input: value,
      expected: args[0],
    })

  not.be = not.bind(this)
  to.be = to.bind(this)
  to.not = not

  return {
    to,
  }
}

export * from './testers.js'
