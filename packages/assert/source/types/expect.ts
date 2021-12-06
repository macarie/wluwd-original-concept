import type { AssertionError } from '@wluwd/common/assertion-error'

type TesterAcceptsValue<Value, Tester> = Tester extends (input: Value, ...args: any[]) => boolean ? Tester : never
type RemainingTesterArguments<Value, Tester> = Tester extends (
  input: Value,
  ...args: infer RemainingArguments
) => boolean
  ? RemainingArguments
  : never

type BaseTester<Value, ReturnValue> = <GivenTester>(
  tester: TesterAcceptsValue<Value, GivenTester>,
  ...args: RemainingTesterArguments<Value, GivenTester>
) => ReturnValue

type BaseExpectProperty<Properties extends Record<string, unknown>, Value> = BaseTester<
  Value,
  true | AssertionError
> & { [Property in keyof Properties]: Properties[Property] }

export type Expect<Value> = {
  to: BaseExpectProperty<
    {
      not: BaseExpectProperty<
        {
          be: BaseTester<Value, true | AssertionError>
        },
        Value
      >
      be: BaseTester<Value, true | AssertionError>
    },
    Value
  >
}
