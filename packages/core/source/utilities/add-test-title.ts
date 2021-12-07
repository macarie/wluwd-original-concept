import type { AssertionError } from '@wluwd/common/assertion-error'

export const addTestTitle = (assertionError: AssertionError, title: string) =>
  Object.defineProperty(assertionError, 'title', { value: title })
