import type { Expect } from './types/expect.js'

export const expect = <ValueType>(value: ValueType): Expect<ValueType> => {
  const to: Expect<ValueType>['to'] = (tester, ...args) => tester(value, ...args)

  const not: Expect<ValueType>['to']['not'] = (tester, ...args) => !tester(value, ...args)

  not.be = not.bind(this)
  to.be = to.bind(this)
  to.not = not

  return {
    to,
  }
}

export * from './testers.js'
