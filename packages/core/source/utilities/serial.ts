import { Result } from '@wluwd/common/result'
import { isAssertionError } from '@wluwd/common/assertion-error'

import type { AssertionError } from '@wluwd/common/assertion-error'
import type { Test } from '../types/test.js'
import type { Hook } from '../types/hook.js'

export const serial = async (
  tests: Test[],
  hooks: { before: Hook['test']; after: Hook['test'] }
): Promise<Array<Result | AssertionError>> =>
  // eslint-disable-next-line unicorn/no-array-reduce
  tests.reduce(async (results, test) => {
    const currentResults = await results

    if (test.skip) {
      return [...currentResults, Result.SKIPPED]
    }

    await hooks.before?.()

    for await (const assertionResult of test.fn()) {
      if (isAssertionError(assertionResult)) {
        await hooks.after?.()

        return [...currentResults, assertionResult]
      }

      if (!assertionResult) {
        await hooks.after?.()

        return [...currentResults, Result.KO]
      }
    }

    await hooks.after?.()

    return [...currentResults, Result.OK]
  }, Promise.resolve([] as Array<Result | AssertionError>))
