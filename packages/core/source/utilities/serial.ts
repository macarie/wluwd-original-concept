import { Result } from '../types/result.js'

import type { Test } from '../types/test.js'
import type { Hook } from '../types/hook.js'

export const serial = async (tests: Test[], hooks: { before: Hook['test']; after: Hook['test'] }): Promise<Result[]> =>
  // eslint-disable-next-line unicorn/no-array-reduce
  tests.reduce(async (results, test) => {
    const currentResults = await results

    if (test.skip) {
      return [...currentResults, Result.SKIPPED]
    }

    await hooks.before?.()

    for await (const assertionResult of test.fn()) {
      if (!assertionResult) {
        await hooks.after?.()

        return [...currentResults, Result.KO]
      }
    }

    await hooks.after?.()

    return [...currentResults, Result.OK]
  }, Promise.resolve([] as Result[]))
