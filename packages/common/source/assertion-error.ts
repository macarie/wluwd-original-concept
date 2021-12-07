const assertionErrorSymbol = Symbol('assertionError')

export type AssertionError = {
  [assertionErrorSymbol]: true
  title: string
  file: {
    path: string
    line: number
    cursor: number
  }
  diff: Array<{
    value: string
    type: 'delete' | 'equal' | 'insert'
  }>
}

export const createAssertionError = (
  errorProperties: Omit<AssertionError, typeof assertionErrorSymbol>
): AssertionError => ({
  [assertionErrorSymbol]: true,
  ...errorProperties,
})

export const isAssertionError = (baseObject: unknown): baseObject is AssertionError =>
  typeof baseObject === 'object' && baseObject !== null && Reflect.has(baseObject, assertionErrorSymbol)
