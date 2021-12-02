import { Result } from '@wluwd/common/result'

import type { Test } from '../types/test.js'

export const parallel = async (tests: Test[]): Promise<Result[]> =>
  Promise.all(
    tests.map(async (test) => {
      if (test.skip) {
        return Result.SKIPPED
      }

      for await (const assertionResult of test.fn()) {
        if (!assertionResult) {
          return Result.KO
        }
      }

      return Result.OK
    })
  )
