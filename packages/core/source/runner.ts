import { Worker } from 'node:worker_threads'
import { resolve, relative } from 'node:path'
import { performance } from 'node:perf_hooks'

import pMap from 'p-map'

import { logResults, logStats } from './utilities/log.js'

import type { WorkerOptions } from 'node:worker_threads'
import type { Result } from '@wluwd/common/result'

const runTest = async (
  test: string,
  { workerOptions, workingDirectory }: { workerOptions?: WorkerOptions; workingDirectory: string }
): Promise<Result[][]> =>
  new Promise((resolve) => {
    const aggregatedResults: Result[][] = []
    const worker = new Worker(test, workerOptions)

    worker.on('message', ({ results, suiteName }: { results: Result[]; suiteName: string }) => {
      aggregatedResults.push(results)
      logResults({
        filename: relative(workingDirectory, test),
        logFilename: true,
        results,
        suiteName,
      })
    })

    worker.on('error', (...args) => {
      console.error(args)

      resolve(aggregatedResults)
    })

    worker.on('exit', () => {
      resolve(aggregatedResults)
    })
  })

type RunnerOptions = {
  concurrency: number
  tests: string[]
  workingDirectory: string
}

export const runner = async ({ concurrency, tests, workingDirectory }: RunnerOptions) => {
  const startTime = performance.now()
  const results = await pMap(tests, async (test) => runTest(resolve(workingDirectory, test), { workingDirectory }), {
    concurrency,
  })
  const endTime = performance.now()

  logStats(results.flat(2), endTime - startTime)
}
