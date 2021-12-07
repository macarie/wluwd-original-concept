import { Result } from '@wluwd/common/result'
import { isAssertionError } from '@wluwd/common/assertion-error'

import { addTestTitle } from './add-test-title.js'

import type { AssertionError } from '@wluwd/common/assertion-error'
import type { Test } from '../types/test.js'

export const parallel = async (tests: Test[]): Promise<Array<Result | AssertionError>> =>
  Promise.all(
    tests.map(async (test) => {
      if (test.skip) {
        return Result.SKIPPED
      }

      for await (const assertionResult of test.fn()) {
        if (isAssertionError(assertionResult)) {
          return addTestTitle(assertionResult, test.name)
        }

        if (!assertionResult) {
          return Result.KO
        }
      }

      return Result.OK
    })
  )
