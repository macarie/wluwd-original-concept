const assertionErrorSymbol = Symbol('assertionError')

export type AssertionError = {
  [assertionErrorSymbol]: true
  file: {
    path: string
    line: number
    cursor: number
  }
  diff: Array<{
    value: string
    type: 'added' | 'removed' | undefined
  }>
}

export const createAssertionError = (
  errorProperties: Omit<AssertionError, typeof assertionErrorSymbol>
): AssertionError => ({
  [assertionErrorSymbol]: true,
  ...errorProperties,
})

export const isAssertionError = (baseObject: AssertionError) => Reflect.has(baseObject, assertionErrorSymbol)
