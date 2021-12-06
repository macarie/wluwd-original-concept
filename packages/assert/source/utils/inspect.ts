import { inspect as inspectObject } from 'node:util'

import type { InspectOptions } from 'node:util'

const inspectOptions: InspectOptions = {
  colors: true,
  depth: Number.POSITIVE_INFINITY,
  maxArrayLength: Number.POSITIVE_INFINITY,
  maxStringLength: Number.POSITIVE_INFINITY,
  sorted: true,
  compact: false,
}

export const inspect = (value: any): string => inspectObject(value, inspectOptions)
