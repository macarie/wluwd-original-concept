import { resultOrError } from './utils/result-or-error.js'

import type { Expect } from './types/expect.js'

export const expect = <InputType>(input: InputType): Expect<InputType> => {
  const to: Expect<InputType>['to'] = (tester, ...args) =>
    resultOrError({
      result: tester(input, ...args),
      origin: to,
      input,
      expected: args[0],
    })

  const not: Expect<InputType>['to']['not'] = (tester, ...args) =>
    resultOrError({
      result: !tester(input, ...args),
      origin: to,
      input,
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
