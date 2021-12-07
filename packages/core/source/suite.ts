import { isMainThread, parentPort } from 'node:worker_threads'
import { cwd } from 'node:process'

import { logResults } from '@wluwd/common/log'

import { parallel } from './utilities/parallel.js'
import { serial } from './utilities/serial.js'

import type { Test } from './types/test.js'
import type { Hook } from './types/hook.js'

type Hooks = {
  before?: Hook
  after?: Hook
}

type SuiteOptions = {
  name: string
  hooks?: Hooks
  tests: Test[]
}

export const suite = async ({ name, hooks, tests }: SuiteOptions) => {
  const filteredTests = tests.some((test) => test.only)
    ? tests.map((test) => (test.only ? test : { ...test, skip: true }))
    : tests
  const executor = hooks?.before?.test || hooks?.after?.test ? serial : parallel

  await hooks?.before?.suite?.()
  const results = await executor(filteredTests, { before: hooks?.before?.test, after: hooks?.after?.test })
  await hooks?.after?.suite?.()

  if (isMainThread) {
    logResults({
      logFilename: false,
      results,
      suiteName: name,
      workingDirectory: cwd(),
    })

    return
  }

  parentPort!.postMessage({
    results,
    suiteName: name,
  })
}
