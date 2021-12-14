import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { relative } from 'node:path'

import {
  bgGreen,
  bgRed,
  bgWhite,
  black,
  bold,
  cyan,
  dim,
  gray,
  green,
  red,
  underline,
  white,
  yellow,
} from 'kleur/colors'

import { Result } from './result.js'
import { messages } from './utils/messages.js'

import type { Colorize } from 'kleur/colors'
import type { AssertionError } from './assertion-error.js'

const okSymbol = green('•')
const koSymbol = red('⨯')
const skippedSymbol = yellow('~')
const minusSymbol = red('  - ')
const plusSymbol = green('  + ')
const padding = '    '
const cleanValue = (string: string): string => string.replace(/\r/g, '').replace(/\n$/, '')

const formatDiff = (diff: AssertionError['diff']): string => {
  let output = ''

  for (const { type, value } of diff.content) {
    if (type === 'equal') {
      for (const line of dim(gray(cleanValue(value))).split('\n')) {
        output += `${padding}${line}\n`
      }
    } else {
      const symbol = type === 'insert' ? plusSymbol : minusSymbol

      for (const line of cleanValue(value).split('\n')) {
        output += `${symbol}${bold(line)}\n`
      }
    }
  }

  return output
}

export const getLines = (file: string, line: number): Array<[number, string]> => {
  const fileContents = readFileSync(file, 'utf8')
  const lines = fileContents.split('\n')

  const output: Array<[number, string]> = []

  const start = Math.max(0, line - 2)
  const end = Math.min(lines.length, line + 1)

  for (let i = start; i < end; i += 1) {
    output.push([i + 1, lines[i]])
  }

  return output
}

const identity = <BaseType>(x: BaseType): BaseType => x
const message = (message: string): string => messages[message] ?? message

const createErrorLog = (assertionError: AssertionError | Result.KO, workingDirectory: string): string => {
  if (assertionError === Result.KO) {
    return 'something went wrong'
  }

  const { path, line, cursor } = assertionError.file
  const filePath = fileURLToPath(path)
  const errorLines = getLines(filePath, line)
  const linePad = Math.log10(line) + 1

  const output = `  ${bold(assertionError.title)}\n  ${dim(
    gray(`» ${relative(workingDirectory, filePath)}:${line}:${cursor}`)
  )}\n\n${errorLines
    .map(([lineNumber, content]) => {
      const isErrorLine = lineNumber === line
      const lineStyles = isErrorLine
        ? {
            bgColor: bgRed,
            modifier: bold,
            numberColor: red,
          }
        : {
            bgColor: identity,
            modifier: dim,
            numberColor: gray,
          }

      return lineStyles.modifier(
        `  ${bgWhite(lineStyles.numberColor(` ${lineNumber.toString().padStart(linePad, ' ')} `))}${lineStyles.bgColor(
          `${content} `
        )}`
      )
    })
    .join('\n')}\n\n  ${message(assertionError.diff.message)}\n\n${formatDiff(assertionError.diff)}\n`

  return output
}

type Stats = {
  ok: number
  ko: number
  skipped: number
  total: number
  symbols: string[]
  errors: string[]
}

const getStats = (results: Array<Result | AssertionError>, workingDirectory?: string) => {
  const stats: Stats = { ok: 0, ko: 0, skipped: 0, total: 0, symbols: [], errors: [] }

  for (const result of results) {
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

        if (workingDirectory) {
          stats.errors.push(createErrorLog(result, workingDirectory))
        }

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
  workingDirectory: string
}

export const logResults = ({
  filename = '',
  logFilename,
  results,
  suiteName,
  workingDirectory,
}: LogResultsOptions): void => {
  const stats = getStats(results, workingDirectory)
  const bgResults = stats.ko > 0 ? bgRed : bgGreen

  const output: string[] = []

  if (logFilename) {
    output.push(underline(white(relative(workingDirectory, filename))))
  }

  output.push(
    `${bgWhite(black(` ${suiteName} `))}${bgResults(white(` ${stats.ok}/${stats.total} `))} ${stats.symbols.join(
      ' '
    )}\n`
  )

  if (stats.errors.length > 0) {
    output.push(`${stats.errors.join('')}`)
  }

  console.log(output.join('\n'))
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
