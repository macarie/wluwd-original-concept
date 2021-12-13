import type { AssertionError } from '@wluwd/common/assertion-error'
import type { createDiff } from './create-diff.js'
import type { inspect } from './inspect.js'

type BaseTester = (...args: any[]) => boolean

type ExplainType<Tester extends BaseTester> = (options: {
  args: Tester extends (...args: infer Arguments) => boolean ? Arguments : never
  createDiff: typeof createDiff
  inspect: typeof inspect
  negated: boolean
}) => AssertionError['diff']

type EnhancedTester<Tester extends BaseTester> = Tester & {
  explain: ExplainType<Tester>
}

export const createTester = <Tester extends BaseTester>(
  tester: Tester,
  explain: ExplainType<Tester>
): EnhancedTester<Tester> => Object.assign<Tester, { explain: ExplainType<Tester> }>(tester, { explain })
