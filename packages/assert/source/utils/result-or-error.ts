import { createAssertionError } from '@wluwd/common/assertion-error'

import { createDiff } from './create-diff.js'
import { inspect } from './inspect.js'

import type { AssertionError } from '@wluwd/common/assertion-error'
import type { createTester } from './create-tester.js'

type ResultOrErrorOptions = {
  args: unknown[]
  negated: boolean
  origin: Function // eslint-disable-line @typescript-eslint/ban-types
  result: boolean
  tester: ReturnType<typeof createTester>
}

const getAssertionErrorOrigin = (stack: string) => /(file:.*?\W\d+\W\d+)\W*$/.exec(stack.split('\n')[1])![1]
const getErrorFile = (errorOrigin: string) => errorOrigin.replace(/\W\d+\W\d+$/, '')
const getErrorLine = (errorOrigin: string) => Number(/(?<line>\d+)\W\d+$/.exec(errorOrigin)?.groups?.line ?? -1)
const getErrorCursor = (errorOrigin: string) => Number(/\d+\W(?<cursor>\d+)$/.exec(errorOrigin)?.groups?.cursor ?? -1)

export const resultOrError = ({
  args,
  negated,
  origin,
  result,
  tester,
}: ResultOrErrorOptions): true | AssertionError => {
  if (result) {
    return true
  }

  const error = new Error('Assertion failed')

  Error.captureStackTrace(error, origin)

  const assertionErrorOrigin = getAssertionErrorOrigin(error.stack!)

  return createAssertionError({
    title: 'Test',
    file: {
      path: getErrorFile(assertionErrorOrigin),
      line: getErrorLine(assertionErrorOrigin),
      cursor: getErrorCursor(assertionErrorOrigin),
    },
    diff: tester.explain({ args, createDiff, inspect, negated }),
  })
}
