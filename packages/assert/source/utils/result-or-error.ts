import { diffLines } from 'diff'
import { createAssertionError } from '@wluwd/common/assertion-error'

import { inspect } from './inspect.js'

import type { AssertionError } from '@wluwd/common/assertion-error'

type ResultOrErrorOptions = {
  result: boolean
  origin: Function // eslint-disable-line @typescript-eslint/ban-types
  input: any
  expected: any
}

const getAssertionErrorOrigin = (stack: string) => stack.split('\n')[1]?.replace('at', '').trim()
const getErrorFile = (errorOrigin: string) => errorOrigin.replace(/\d+\W\d+$/, '')
const getErrorLine = (errorOrigin: string) => Number(/(?<line>\d+)\W\d+$/.exec(errorOrigin)?.groups?.line ?? -1)
const getErrorCursor = (errorOrigin: string) => Number(/\d+\W(?<cursor>\d+)$/.exec(errorOrigin)?.groups?.cursor ?? -1)
const createDiff = (input: string, expected: string): AssertionError['diff'] =>
  diffLines(input, expected).map(({ added, removed, value }) => ({
    type: added ? 'insert' : removed ? 'delete' : 'equal',
    value,
  }))

export const resultOrError = ({ result, origin, input, expected }: ResultOrErrorOptions): true | AssertionError => {
  if (result) {
    return true
  }

  const error = new Error('Assertion failed')

  Error.captureStackTrace(error, origin)

  const assertionErrorOrigin = getAssertionErrorOrigin(error.stack!)

  return createAssertionError({
    file: {
      path: getErrorFile(assertionErrorOrigin),
      line: getErrorLine(assertionErrorOrigin),
      cursor: getErrorCursor(assertionErrorOrigin),
    },
    diff: createDiff(inspect(input), inspect(expected)),
  })
}
