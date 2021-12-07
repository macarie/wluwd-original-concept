import { bgGreen, bgRed, bgWhite, black, cyan, dim, green, red, underline, white, yellow } from 'kleur/colors'

import { Result } from './result.js'

import type { Colorize } from 'kleur/colors'
import type { AssertionError } from './assertion-error.js'

const okSymbol = green('•')
const koSymbol = red('⨯')
const skippedSymbol = yellow('~')

type Stats = {
  ok: number
  ko: number
  skipped: number
  total: number
  symbols: string[]
}

  const stats: Stats = { ok: 0, ko: 0, skipped: 0, total: 0, symbols: [] }
const getStats = (results: Array<Result | AssertionError>) => {

  for (const result of results) {
    // eslint-disable-next-line default-case
    switch (result) {
      case Result.OK:
        stats.ok += 1
        stats.symbols.push(okSymbol)

        break

      case Result.SKIPPED:
        stats.skipped += 1
        stats.symbols.push(skippedSymbol)

        break

      case Result.KO:
      default:
        stats.ko += 1
        stats.symbols.push(koSymbol)
        break
    }
  }

  stats.total = stats.ok + stats.ko + stats.skipped

  return stats
}

type LogResultsOptions = {
  filename?: string
  logFilename: boolean
  results: Array<Result | AssertionError>
  suiteName: string
}

export const logResults = ({ filename = '', logFilename, results, suiteName }: LogResultsOptions): void => {
  const stats = getStats(results)
  const bgResults = stats.ko > 0 ? bgRed : bgGreen

  if (logFilename) {
    console.log(underline(white(filename)))
  }

  console.log(
    `${bgWhite(black(` ${suiteName} `))}${bgResults(white(` ${stats.ok}/${stats.total} `))} ${stats.symbols.join(
      ' '
    )}\n`
  )
}

const createStatLog = ([label, formatter]: [string, Colorize], rightPad: number, data: number | string) => {
  const message = formatter(`${label.padEnd(rightPad, ' ')} ${data}`)

  return data ? message : dim(message)
}

const formatTime = (time: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'unit',
    unit: time > 10_000 ? 'second' : 'millisecond',
    unitDisplay: 'narrow',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(time)

const labels: Array<[string, Colorize]> = [
  ['  Total:', white],
  ['  Passed:', green],
  ['  Skipped:', yellow],
  ['  Failed:', red],
  ['  Done in', cyan],
]

export const logStats = (results: Result[], time: number) => {
  const rightPad = Math.max(...labels.map((label) => label[0].length)) + 1
  const stats = getStats(results)

  console.log()

  console.log(createStatLog(labels[0], rightPad, stats.total))
  console.log(createStatLog(labels[1], rightPad, stats.ok))
  console.log(createStatLog(labels[2], rightPad, stats.skipped))
  console.log(createStatLog(labels[3], rightPad, stats.ko))

  console.log()

  console.log(dim(createStatLog(labels[4], 0, formatTime(time))))
}
