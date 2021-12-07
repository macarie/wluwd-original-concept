import type { AssertionError } from '@wluwd/common/assertion-error'

export type Test = {
  name: string
  skip?: boolean
  only?: boolean
  fn: () => AsyncGenerator<boolean | AssertionError, void>
}
