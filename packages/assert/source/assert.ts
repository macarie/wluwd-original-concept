type TesterAcceptsValue<Value, Tester> = Tester extends (input: Value, ...args: unknown[]) => boolean ? Tester : never
type RemainingTesterArguments<Tester> = Tester extends (input: unknown, ...args: infer RemainingArguments) => boolean
  ? RemainingArguments
  : never

// TODO: Find a better way to define the *main* function
type ExpectBe<Value> = <Tester>(
  fn: TesterAcceptsValue<Value, Tester>,
  ...args: RemainingTesterArguments<Tester>
) => boolean

type ExpectNot<Value> = {
  <Tester>(fn: TesterAcceptsValue<Value, Tester>, ...args: RemainingTesterArguments<Tester>): boolean
  be: ExpectBe<Value>
}

type ExpectTo<Value> = {
  <Tester>(fn: TesterAcceptsValue<Value, Tester>, ...args: RemainingTesterArguments<Tester>): boolean
  be: ExpectBe<Value>
  not: ExpectNot<Value>
}

type Expect<Value> = {
  to: ExpectTo<Value>
}

export const expect = <ValueType>(value: ValueType): Expect<ValueType> => {
  const to = <TesterType>(
    fn: TesterAcceptsValue<ValueType, TesterType>,
    ...args: RemainingTesterArguments<TesterType>
  ) => fn(value, ...args)

  const not = <TesterType>(
    fn: TesterAcceptsValue<ValueType, TesterType>,
    ...args: RemainingTesterArguments<TesterType>
  ) => !fn(value, ...args)

  not.be = not.bind(this)
  to.be = to.bind(this)
  to.not = not

  return {
    to,
  }
}
