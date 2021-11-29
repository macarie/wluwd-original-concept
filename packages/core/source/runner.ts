import { Worker } from 'node:worker_threads'
import { resolve, relative } from 'node:path'

import pMap from 'p-map'

import { logResults } from './log.js'

import type { WorkerOptions } from 'node:worker_threads'
import type { Result } from './types/result.js'

const runTest = async (
  test: string,
  { workerOptions, workingDirectory }: { workerOptions?: WorkerOptions; workingDirectory: string }
): Promise<void> =>
  new Promise((resolve) => {
    const worker = new Worker(test, workerOptions)

    worker.on('message', ({ results, suiteName }: { results: Result[]; suiteName: string }) => {
      logResults({
        filename: relative(workingDirectory, test),
        logFilename: true,
        results,
        suiteName,
      })
    })

    worker.on('error', (...args) => {
      console.error(args)

      resolve()
    })

    worker.on('exit', () => {
      resolve()
    })
  })

type RunnerOptions = {
  concurrency: number
  tests: string[]
  workingDirectory: string
}

export const runner = async ({ concurrency, tests, workingDirectory }: RunnerOptions) => {
  await pMap(tests, async (test) => runTest(resolve(workingDirectory, test), { workingDirectory }), { concurrency })
}
