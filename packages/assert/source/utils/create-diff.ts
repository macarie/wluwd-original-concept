import { diffLines } from 'diff'

import type { AssertionError } from '@wluwd/common/assertion-error'

export const createDiff = (input: string, expected: string): AssertionError['diff']['content'] =>
  diffLines(input, expected).map(({ added, removed, value }) => ({
    type: added ? 'insert' : removed ? 'delete' : 'equal',
    value,
  }))
