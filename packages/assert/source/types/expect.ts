import type { AssertionError } from '@wluwd/common/assertion-error'

type TesterAcceptsValue<Input, Tester> = Tester extends (input: Input, ...args: any[]) => boolean ? Tester : never
type RemainingTesterArguments<Input, Tester> = Tester extends (
  input: Input,
  ...args: infer RemainingArguments
) => boolean
  ? RemainingArguments
  : never

type BaseTester<Input, ReturnValue> = <GivenTester>(
  tester: TesterAcceptsValue<Input, GivenTester>,
  ...args: RemainingTesterArguments<Input, GivenTester>
) => ReturnValue

type BaseExpectProperty<Properties extends Record<string, unknown>, Input> = BaseTester<
  Input,
  true | AssertionError
> & { [Property in keyof Properties]: Properties[Property] }

export type Expect<Input> = {
  to: BaseExpectProperty<
    {
      not: BaseExpectProperty<
        {
          be: BaseTester<Input, true | AssertionError>
        },
        Input
      >
      be: BaseTester<Input, true | AssertionError>
    },
    Input
  >
}
