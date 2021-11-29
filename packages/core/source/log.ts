import { bgGreen, bgRed, bgWhite, black, green, red, underline, white, yellow } from 'kleur/colors'

import { Result } from './types/result.js'

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

const getStats = (results: Result[]) => {
  const stats: Stats = { ok: 0, ko: 0, skipped: 0, total: 0, symbols: [] }

  for (const result of results) {
    // eslint-disable-next-line default-case
    switch (result) {
      case Result.OK:
        stats.ok += 1
        stats.symbols.push(okSymbol)

        break

      case Result.KO:
        stats.ko += 1
        stats.symbols.push(koSymbol)

        break

      case Result.SKIPPED:
        stats.skipped += 1
        stats.symbols.push(skippedSymbol)

        break
    }
  }

  stats.total = stats.ok + stats.ko + stats.skipped

  return stats
}

type LogResultsOptions = {
  filename?: string
  logFilename: boolean
  results: Result[]
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
